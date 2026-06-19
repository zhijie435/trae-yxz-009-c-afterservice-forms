const {
  updateInvoiceStatus: updateInvoiceStatusUtil,
  findInvoiceOrder,
  validateInvoiceOrderExists,
  handleError
} = require('../utils/orderStatusManager');
const invoiceOrders = require('../models/invoiceOrders');

const orders = invoiceOrders;

const invoiceTitles = [
  {
    id: 1,
    type: 'personal',
    title: '个人',
    taxNumber: '',
    isDefault: true
  },
  {
    id: 2,
    type: 'company',
    title: '某某科技有限公司',
    taxNumber: '91110000MA01A2BC3D',
    isDefault: false
  }
];

const addressList = [
  {
    id: 1,
    name: '张三',
    phone: '138****8888',
    province: '北京市',
    city: '北京市',
    district: '朝阳区',
    detail: '建国路88号SOHO现代城A座1203室',
    isDefault: true
  },
  {
    id: 2,
    name: '李四',
    phone: '139****9999',
    province: '上海市',
    city: '上海市',
    district: '浦东新区',
    detail: '陆家嘴金融中心B座2001室',
    isDefault: false
  }
];

const getInvoiceOrders = (req, res) => {
  try {
    const availableOrders = orders.filter(order => !order.hasInvoice);
    res.json({
      code: 200,
      message: 'success',
      data: {
        orders: availableOrders
      }
    });
  } catch (error) {
    handleError(res, error, '获取订单列表失败');
  }
};

const getInvoiceTitles = (req, res) => {
  try {
    res.json({
      code: 200,
      message: 'success',
      data: {
        titles: invoiceTitles
      }
    });
  } catch (error) {
    handleError(res, error, '获取发票抬头失败');
  }
};

const getAddressList = (req, res) => {
  try {
    res.json({
      code: 200,
      message: 'success',
      data: {
        addresses: addressList
      }
    });
  } catch (error) {
    handleError(res, error, '获取地址列表失败');
  }
};

const submitInvoiceApplication = (req, res) => {
  try {
    const { orderIds, invoiceType, invoiceTitle, taxNumber, addressId, remark } = req.body;

    if (!orderIds || orderIds.length === 0) {
      return res.status(400).json({
        code: 400,
        message: '请选择需要开票的订单'
      });
    }

    if (!invoiceType) {
      return res.status(400).json({
        code: 400,
        message: '请选择发票类型'
      });
    }

    if (!invoiceTitle) {
      return res.status(400).json({
        code: 400,
        message: '请填写发票抬头'
      });
    }

    if (invoiceType === 'company' && !taxNumber) {
      return res.status(400).json({
        code: 400,
        message: '请填写纳税人识别号'
      });
    }

    if (!addressId) {
      return res.status(400).json({
        code: 400,
        message: '请选择收件地址'
      });
    }

    const selectedOrders = orders.filter(order => orderIds.includes(order.id));
    const totalAmount = selectedOrders.reduce((sum, order) => sum + order.amount, 0);
    const invoiceId = 'FP' + Date.now() + Math.floor(Math.random() * 10000);

    const address = addressList.find(addr => addr.id === addressId) || addressList[0];

    const addressData = {
      name: address.name,
      phone: address.phone,
      fullAddress: `${address.province}${address.city}${address.district}${address.detail}`
    };

    updateInvoiceStatusUtil(orderIds, 'pending', {
      invoiceId,
      invoiceType,
      invoiceTitle,
      taxNumber,
      totalAmount,
      address: addressData,
      remark
    });

    res.json({
      code: 200,
      message: '提交成功',
      data: {
        invoiceId,
        invoiceType,
        invoiceTitle,
        taxNumber: taxNumber || '',
        totalAmount,
        orderCount: selectedOrders.length,
        orders: selectedOrders,
        address: addressData,
        remark: remark || '',
        status: 'pending',
        statusName: '待开票',
        createTime: new Date().toLocaleString('zh-CN'),
        expectedDelivery: '预计3-5个工作日内寄出'
      }
    });
  } catch (error) {
    handleError(res, error, '提交发票申请失败');
  }
};

const updateInvoiceStatus = (req, res) => {
  try {
    const { orderIds, status, invoiceId, expressNumber } = req.body;

    if (!orderIds || orderIds.length === 0) {
      return res.status(400).json({
        code: 400,
        message: '订单ID不能为空'
      });
    }

    if (!invoiceId) {
      return res.status(400).json({
        code: 400,
        message: '发票ID不能为空'
      });
    }

    const updatedOrders = updateInvoiceStatusUtil(orderIds, status, {
      invoiceId,
      expressNumber
    });

    res.json({
      code: 200,
      message: '发票状态更新成功',
      data: {
        updatedCount: updatedOrders.length,
        orders: updatedOrders.map(o => ({
          orderId: o.id,
          hasInvoice: o.hasInvoice,
          invoices: o.invoices
        }))
      }
    });
  } catch (error) {
    handleError(res, error, '更新发票状态失败');
  }
};

module.exports = {
  getInvoiceOrders,
  getInvoiceTitles,
  getAddressList,
  submitInvoiceApplication,
  updateInvoiceStatus
};
