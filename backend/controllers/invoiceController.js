const orders = [
  {
    id: 'ZL202501010001',
    type: 'rent',
    typeName: '房租订单',
    roomNumber: 'A栋1203室',
    amount: 3500,
    period: '2026-01-01 至 2026-01-31',
    createTime: '2026-01-01 10:00:00',
    hasInvoice: false
  },
  {
    id: 'ZL202502010002',
    type: 'rent',
    typeName: '房租订单',
    roomNumber: 'A栋1203室',
    amount: 3500,
    period: '2026-02-01 至 2026-02-28',
    createTime: '2026-02-01 10:00:00',
    hasInvoice: false
  },
  {
    id: 'ZL202503010003',
    type: 'rent',
    typeName: '房租订单',
    roomNumber: 'A栋1203室',
    amount: 3500,
    period: '2026-03-01 至 2026-03-31',
    createTime: '2026-03-01 10:00:00',
    hasInvoice: true
  },
  {
    id: 'XZ202501150001',
    type: 'repair',
    typeName: '报修订单',
    roomNumber: 'A栋1203室',
    amount: 180,
    period: '空调维修',
    createTime: '2026-01-15 14:30:00',
    hasInvoice: false
  },
  {
    id: 'XZ202502200002',
    type: 'repair',
    typeName: '报修订单',
    roomNumber: 'A栋1203室',
    amount: 120,
    period: '水龙头更换',
    createTime: '2026-02-20 09:15:00',
    hasInvoice: false
  }
];

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
    res.status(500).json({
      code: 500,
      message: '获取订单列表失败',
      error: error.message
    });
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
    res.status(500).json({
      code: 500,
      message: '获取发票抬头失败',
      error: error.message
    });
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
    res.status(500).json({
      code: 500,
      message: '获取地址列表失败',
      error: error.message
    });
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
        address: {
          name: address.name,
          phone: address.phone,
          fullAddress: `${address.province}${address.city}${address.district}${address.detail}`
        },
        remark: remark || '',
        status: 'pending',
        statusName: '待开票',
        createTime: new Date().toLocaleString('zh-CN'),
        expectedDelivery: '预计3-5个工作日内寄出'
      }
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '提交发票申请失败',
      error: error.message
    });
  }
};

module.exports = {
  getInvoiceOrders,
  getInvoiceTitles,
  getAddressList,
  submitInvoiceApplication
};
