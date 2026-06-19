const orders = require('../models/orders');

const getOrderList = (req, res) => {
  try {
    const orderList = orders.map(order => ({
      id: order.id,
      orderNo: order.orderNo,
      type: order.type,
      typeName: order.typeName,
      status: order.status,
      statusText: order.statusText,
      statusColor: order.statusColor,
      roomNumber: order.roomNumber,
      monthlyRent: order.monthlyRent,
      startDate: order.startDate,
      endDate: order.endDate,
      renewalStatus: order.renewal.status,
      renewalStatusText: order.renewal.statusText,
      terminationStatus: order.termination.status,
      terminationStatusText: order.termination.statusText
    }));

    res.json({
      code: 200,
      message: 'success',
      data: {
        orders: orderList,
        total: orderList.length
      }
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '获取订单列表失败',
      error: error.message
    });
  }
};

const getOrderDetail = (req, res) => {
  try {
    const { orderId } = req.query;

    if (!orderId) {
      return res.status(400).json({
        code: 400,
        message: '订单ID不能为空'
      });
    }

    const order = orders.find(o => o.id === orderId);

    if (!order) {
      return res.status(404).json({
        code: 404,
        message: '订单不存在'
      });
    }

    res.json({
      code: 200,
      message: 'success',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '获取订单详情失败',
      error: error.message
    });
  }
};

const updateRenewalStatus = (req, res) => {
  try {
    const { orderId, status, startDate, endDate, monthlyRent, discount } = req.body;

    if (!orderId) {
      return res.status(400).json({
        code: 400,
        message: '订单ID不能为空'
      });
    }

    const order = orders.find(o => o.id === orderId);
    if (!order) {
      return res.status(404).json({
        code: 404,
        message: '订单不存在'
      });
    }

    const statusMap = {
      none: { status: 'none', statusText: '未申请' },
      pending: { status: 'pending', statusText: '审核中' },
      approved: { status: 'approved', statusText: '已同意' },
      rejected: { status: 'rejected', statusText: '已拒绝' },
      completed: { status: 'completed', statusText: '已完成' }
    };

    const statusInfo = statusMap[status] || statusMap.none;

    order.renewal.status = statusInfo.status;
    order.renewal.statusText = statusInfo.statusText;
    order.renewal.applicationTime = status !== 'none' ? new Date().toLocaleString('zh-CN') : null;
    order.renewal.approvedTime = status === 'approved' || status === 'completed' ? new Date().toLocaleString('zh-CN') : null;
    order.renewal.newStartDate = startDate || null;
    order.renewal.newEndDate = endDate || null;
    order.renewal.newMonthlyRent = monthlyRent || null;
    order.renewal.discount = discount || 0;

    res.json({
      code: 200,
      message: '续租状态更新成功',
      data: {
        orderId: order.id,
        renewal: order.renewal
      }
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '更新续租状态失败',
      error: error.message
    });
  }
};

const updateTerminationStatus = (req, res) => {
  try {
    const { orderId, status, moveOutDate, refundAmount, reason } = req.body;

    if (!orderId) {
      return res.status(400).json({
        code: 400,
        message: '订单ID不能为空'
      });
    }

    const order = orders.find(o => o.id === orderId);
    if (!order) {
      return res.status(404).json({
        code: 404,
        message: '订单不存在'
      });
    }

    const statusMap = {
      none: { status: 'none', statusText: '未申请' },
      pending: { status: 'pending', statusText: '审核中' },
      approved: { status: 'approved', statusText: '已同意' },
      rejected: { status: 'rejected', statusText: '已拒绝' },
      completed: { status: 'completed', statusText: '已完成' }
    };

    const statusInfo = statusMap[status] || statusMap.none;

    order.termination.status = statusInfo.status;
    order.termination.statusText = statusInfo.statusText;
    order.termination.applicationTime = status !== 'none' ? new Date().toLocaleString('zh-CN') : null;
    order.termination.approvedTime = status === 'approved' || status === 'completed' ? new Date().toLocaleString('zh-CN') : null;
    order.termination.moveOutDate = moveOutDate || null;
    order.termination.refundAmount = refundAmount || null;
    order.termination.reason = reason || null;

    if (status === 'completed') {
      order.status = 'terminated';
      order.statusText = '已退租';
      order.statusColor = '#969799';
    }

    res.json({
      code: 200,
      message: '退租状态更新成功',
      data: {
        orderId: order.id,
        status: order.status,
        statusText: order.statusText,
        termination: order.termination
      }
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '更新退租状态失败',
      error: error.message
    });
  }
};

const updateRepairStatus = (req, res) => {
  try {
    const { orderId, repairId, status, workerName, workerPhone, fee, comment } = req.body;

    if (!orderId || !repairId) {
      return res.status(400).json({
        code: 400,
        message: '订单ID和报修ID不能为空'
      });
    }

    const order = orders.find(o => o.id === orderId);
    if (!order) {
      return res.status(404).json({
        code: 404,
        message: '订单不存在'
      });
    }

    const repair = order.repairs.find(r => r.id === repairId);
    if (!repair) {
      return res.status(404).json({
        code: 404,
        message: '报修记录不存在'
      });
    }

    const statusMap = {
      pending: { status: 'pending', statusText: '待处理', statusColor: '#ff976a' },
      in_progress: { status: 'in_progress', statusText: '处理中', statusColor: '#ff976a' },
      completed: { status: 'completed', statusText: '已完成', statusColor: '#07c160' },
      cancelled: { status: 'cancelled', statusText: '已取消', statusColor: '#969799' }
    };

    const statusInfo = statusMap[status] || statusMap.pending;

    repair.status = statusInfo.status;
    repair.statusText = statusInfo.statusText;
    repair.statusColor = statusInfo.statusColor;
    if (workerName) repair.workerName = workerName;
    if (workerPhone) repair.workerPhone = workerPhone;
    if (fee !== undefined) repair.fee = fee;
    if (comment) repair.comment = comment;

    res.json({
      code: 200,
      message: '报修状态更新成功',
      data: {
        orderId: order.id,
        repair: repair
      }
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '更新报修状态失败',
      error: error.message
    });
  }
};

module.exports = {
  getOrderList,
  getOrderDetail,
  updateRenewalStatus,
  updateTerminationStatus,
  updateRepairStatus
};
