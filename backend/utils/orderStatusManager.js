const orders = require('../models/orders');
const invoiceOrders = require('../models/invoiceOrders');

const STATUS_MAPS = {
  renewal: {
    none: { status: 'none', statusText: '未申请' },
    pending: { status: 'pending', statusText: '审核中' },
    approved: { status: 'approved', statusText: '已同意' },
    rejected: { status: 'rejected', statusText: '已拒绝' },
    completed: { status: 'completed', statusText: '已完成' }
  },
  termination: {
    none: { status: 'none', statusText: '未申请' },
    pending: { status: 'pending', statusText: '审核中' },
    approved: { status: 'approved', statusText: '已同意' },
    rejected: { status: 'rejected', statusText: '已拒绝' },
    completed: { status: 'completed', statusText: '已完成' }
  },
  repair: {
    pending: { status: 'pending', statusText: '待处理', statusColor: '#ff976a' },
    in_progress: { status: 'in_progress', statusText: '处理中', statusColor: '#ff976a' },
    repairing: { status: 'repairing', statusText: '维修中', statusColor: '#ff976a' },
    completed: { status: 'completed', statusText: '已完成', statusColor: '#07c160' },
    cancelled: { status: 'cancelled', statusText: '已取消', statusColor: '#969799' }
  },
  invoice: {
    pending: { status: 'pending', statusText: '待开票' },
    processing: { status: 'processing', statusText: '开票中' },
    completed: { status: 'completed', statusText: '已开票' },
    shipped: { status: 'shipped', statusText: '已寄出' },
    rejected: { status: 'rejected', statusText: '已拒绝' }
  },
  order: {
    active: { status: 'active', statusText: '租赁中', statusColor: '#07c160' },
    terminated: { status: 'terminated', statusText: '已退租', statusColor: '#969799' },
    expired: { status: 'expired', statusText: '已到期', statusColor: '#969799' }
  }
};

const STATUS_COLORS = {
  renewal: {
    pending: '#ff976a',
    approved: '#07c160',
    rejected: '#ee0a24',
    completed: '#1989fa'
  },
  termination: {
    pending: '#ff976a',
    approved: '#07c160',
    rejected: '#ee0a24',
    completed: '#969799'
  }
};

const getStatusInfo = (type, status) => {
  const map = STATUS_MAPS[type];
  if (!map) return null;
  return map[status] || map.none || map.pending || null;
};

const getStatusColor = (type, status) => {
  const colors = STATUS_COLORS[type];
  if (!colors) return '#969799';
  return colors[status] || '#969799';
};

const findOrder = (orderId) => {
  return orders.find(o => o.id === orderId);
};

const validateOrderExists = (orderId, res) => {
  if (!orderId) {
    res.status(400).json({
      code: 400,
      message: '订单ID不能为空'
    });
    return null;
  }

  const order = findOrder(orderId);
  if (!order) {
    res.status(404).json({
      code: 404,
      message: '订单不存在'
    });
    return null;
  }

  return order;
};

const findInvoiceOrder = (orderId) => {
  return invoiceOrders.find(o => o.id === orderId);
};

const validateInvoiceOrderExists = (orderId, res) => {
  const order = findInvoiceOrder(orderId);
  if (!order) {
    res.status(404).json({
      code: 404,
      message: '缴费订单不存在'
    });
    return null;
  }
  return order;
};

const formatDate = (date) => {
  return new Date(date).toLocaleString('zh-CN');
};

const calculateEndDate = (startDate, months) => {
  const date = new Date(startDate);
  date.setMonth(date.getMonth() + months);
  date.setDate(date.getDate() - 1);
  return date.toISOString().split('T')[0];
};

const updateRenewalStatus = (orderId, status, options = {}) => {
  const order = findOrder(orderId);
  if (!order) return null;

  const statusInfo = getStatusInfo('renewal', status);
  if (!statusInfo) return null;

  const now = new Date();

  order.renewal.status = statusInfo.status;
  order.renewal.statusText = statusInfo.statusText;
  order.renewal.applicationTime = status !== 'none' ? formatDate(now) : null;
  order.renewal.approvedTime = (status === 'approved' || status === 'completed') ? formatDate(now) : null;

  if (options.startDate) order.renewal.newStartDate = options.startDate;
  if (options.endDate) order.renewal.newEndDate = options.endDate;
  if (options.monthlyRent !== undefined) order.renewal.newMonthlyRent = options.monthlyRent;
  if (options.discount !== undefined) order.renewal.discount = options.discount;

  return order;
};

const updateTerminationStatus = (orderId, status, options = {}) => {
  const order = findOrder(orderId);
  if (!order) return null;

  const statusInfo = getStatusInfo('termination', status);
  if (!statusInfo) return null;

  const now = new Date();

  order.termination.status = statusInfo.status;
  order.termination.statusText = statusInfo.statusText;
  order.termination.applicationTime = status !== 'none' ? formatDate(now) : null;
  order.termination.approvedTime = (status === 'approved' || status === 'completed') ? formatDate(now) : null;

  if (options.moveOutDate) order.termination.moveOutDate = options.moveOutDate;
  if (options.refundAmount !== undefined) order.termination.refundAmount = options.refundAmount;
  if (options.reason !== undefined) order.termination.reason = options.reason;

  if (status === 'completed') {
    const orderStatusInfo = getStatusInfo('order', 'terminated');
    if (orderStatusInfo) {
      order.status = orderStatusInfo.status;
      order.statusText = orderStatusInfo.statusText;
      order.statusColor = orderStatusInfo.statusColor;
    }
  }

  return order;
};

const updateRepairStatus = (orderId, repairId, status, options = {}) => {
  const order = findOrder(orderId);
  if (!order) return null;

  const repair = order.repairs.find(r => r.id === repairId);
  if (!repair) return { order, repair: null };

  const statusInfo = getStatusInfo('repair', status);
  if (!statusInfo) return { order, repair };

  repair.status = statusInfo.status;
  repair.statusText = statusInfo.statusText;
  repair.statusColor = statusInfo.statusColor;

  if (options.workerName) repair.workerName = options.workerName;
  if (options.workerPhone) repair.workerPhone = options.workerPhone;
  if (options.fee !== undefined) repair.fee = options.fee;
  if (options.comment !== undefined) repair.comment = options.comment;

  return { order, repair };
};

const updateInvoiceStatus = (orderIds, status, options = {}) => {
  const updatedOrders = [];
  const ids = Array.isArray(orderIds) ? orderIds : [orderIds];

  for (const orderId of ids) {
    const order = findInvoiceOrder(orderId);
    if (!order) continue;

    if (status === 'completed' || status === 'shipped') {
      order.hasInvoice = true;
    }

    if (!order.invoices) {
      order.invoices = [];
    }

    if (options.invoiceId) {
      const existingInvoice = order.invoices.find(inv => inv.invoiceId === options.invoiceId);
      const statusInfo = getStatusInfo('invoice', status);

      if (existingInvoice) {
        existingInvoice.status = statusInfo?.status || status;
        existingInvoice.statusText = statusInfo?.statusText || status;
        if (options.invoiceType) existingInvoice.invoiceType = options.invoiceType;
        if (options.invoiceTitle) existingInvoice.invoiceTitle = options.invoiceTitle;
        if (options.taxNumber !== undefined) existingInvoice.taxNumber = options.taxNumber;
        if (options.totalAmount !== undefined) existingInvoice.totalAmount = options.totalAmount;
        if (options.address) existingInvoice.address = options.address;
        if (options.expressNumber) existingInvoice.expressNumber = options.expressNumber;
        if (options.remark !== undefined) existingInvoice.remark = options.remark;
      } else {
        order.invoices.push({
          invoiceId: options.invoiceId,
          status: statusInfo?.status || status,
          statusText: statusInfo?.statusText || status,
          invoiceType: options.invoiceType,
          invoiceTitle: options.invoiceTitle,
          taxNumber: options.taxNumber || '',
          totalAmount: options.totalAmount || 0,
          address: options.address || null,
          expressNumber: options.expressNumber || '',
          remark: options.remark || '',
          createTime: formatDate(new Date())
        });
      }
    }

    updatedOrders.push(order);
  }

  return updatedOrders;
};

const handleError = (res, error, message) => {
  res.status(500).json({
    code: 500,
    message: message || '操作失败',
    error: error.message
  });
};

module.exports = {
  STATUS_MAPS,
  STATUS_COLORS,
  getStatusInfo,
  getStatusColor,
  findOrder,
  validateOrderExists,
  findInvoiceOrder,
  validateInvoiceOrderExists,
  formatDate,
  calculateEndDate,
  updateRenewalStatus,
  updateTerminationStatus,
  updateRepairStatus,
  updateInvoiceStatus,
  handleError
};
