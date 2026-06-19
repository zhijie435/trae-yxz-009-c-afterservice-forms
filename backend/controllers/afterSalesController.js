const afterSalesOrders = [
  {
    id: 'AS20260615001',
    orderNo: 'AS20260615001',
    type: 'repair',
    typeName: '维修售后',
    title: '空调不制冷维修',
    description: '空调不制冷，开机后只有风没有冷气，已经持续2天了。',
    relatedOrderNo: 'BX20260115001',
    roomNumber: 'A栋1203室',
    tenantName: '张三',
    tenantPhone: '138****8888',
    status: 'processing',
    statusText: '处理中',
    statusColor: '#ff976a',
    priority: 'normal',
    priorityText: '普通',
    createTime: '2026-06-15 14:30:00',
    estimatedResolveTime: '2026-06-17 18:00:00',
    handler: {
      name: '客服小王',
      role: '售后专员',
      phone: '400-123-4567'
    },
    images: [
      'https://picsum.photos/200/200?random=1',
      'https://picsum.photos/200/200?random=2'
    ],
    statusTracks: [
      {
        status: 'submitted',
        statusText: '工单已提交',
        time: '2026-06-15 14:30:00',
        description: '您的售后工单已成功提交，等待客服受理',
        operator: '系统',
        type: 'system'
      },
      {
        status: 'accepted',
        statusText: '工单已受理',
        time: '2026-06-15 15:00:00',
        description: '客服小王已受理您的工单，正在核实问题',
        operator: '客服小王',
        type: 'customer_service'
      },
      {
        status: 'processing',
        statusText: '处理中',
        time: '2026-06-16 09:30:00',
        description: '已安排维修人员上门处理，预计今日下午到达',
        operator: '客服小王',
        type: 'customer_service'
      }
    ],
    vouchers: [
      {
        id: 1,
        type: 'image',
        url: 'https://picsum.photos/200/200?random=3',
        name: '空调铭牌.jpg',
        uploadTime: '2026-06-15 14:35:00',
        uploader: '张三'
      }
    ],
    serviceRating: null,
    comment: ''
  },
  {
    id: 'AS20260610002',
    orderNo: 'AS20260610002',
    type: 'refund',
    typeName: '退款售后',
    title: '退租押金退款',
    description: '退租后押金未按时退还，已超过约定时间3天。',
    relatedOrderNo: 'TZ20260520001',
    roomNumber: 'A栋1203室',
    tenantName: '张三',
    tenantPhone: '138****8888',
    status: 'pending',
    statusText: '待处理',
    statusColor: '#1989fa',
    priority: 'high',
    priorityText: '紧急',
    createTime: '2026-06-10 10:15:00',
    estimatedResolveTime: '2026-06-13 18:00:00',
    handler: {
      name: '',
      role: '',
      phone: ''
    },
    images: [
      'https://picsum.photos/200/200?random=4'
    ],
    statusTracks: [
      {
        status: 'submitted',
        statusText: '工单已提交',
        time: '2026-06-10 10:15:00',
        description: '您的售后工单已成功提交，等待客服受理',
        operator: '系统',
        type: 'system'
      }
    ],
    vouchers: [],
    serviceRating: null,
    comment: ''
  },
  {
    id: 'AS20260601003',
    orderNo: 'AS20260601003',
    type: 'invoice',
    typeName: '发票售后',
    title: '发票信息错误',
    description: '开具的发票抬头有误，需要重新开具。',
    relatedOrderNo: 'FP20260501001',
    roomNumber: 'A栋1203室',
    tenantName: '张三',
    tenantPhone: '138****8888',
    status: 'completed',
    statusText: '已完成',
    statusColor: '#07c160',
    priority: 'normal',
    priorityText: '普通',
    createTime: '2026-06-01 09:00:00',
    estimatedResolveTime: '2026-06-03 18:00:00',
    handler: {
      name: '客服小李',
      role: '财务专员',
      phone: '400-123-4567'
    },
    images: [],
    statusTracks: [
      {
        status: 'submitted',
        statusText: '工单已提交',
        time: '2026-06-01 09:00:00',
        description: '您的售后工单已成功提交，等待客服受理',
        operator: '系统',
        type: 'system'
      },
      {
        status: 'accepted',
        statusText: '工单已受理',
        time: '2026-06-01 10:30:00',
        description: '客服小李已受理您的工单，正在核实发票信息',
        operator: '客服小李',
        type: 'customer_service'
      },
      {
        status: 'processing',
        statusText: '处理中',
        time: '2026-06-02 14:00:00',
        description: '已重新开具发票，预计3个工作日内寄达',
        operator: '客服小李',
        type: 'customer_service'
      },
      {
        status: 'completed',
        statusText: '已完成',
        time: '2026-06-03 16:00:00',
        description: '发票已重新开具并寄出，请注意查收',
        operator: '客服小李',
        type: 'customer_service'
      }
    ],
    vouchers: [
      {
        id: 2,
        type: 'image',
        url: 'https://picsum.photos/200/200?random=5',
        name: '原发票照片.jpg',
        uploadTime: '2026-06-01 09:10:00',
        uploader: '张三'
      }
    ],
    serviceRating: 5,
    comment: '处理速度很快，服务态度很好！'
  },
  {
    id: 'AS20260520004',
    orderNo: 'AS20260520004',
    type: 'renewal',
    typeName: '续租售后',
    title: '续租价格争议',
    description: '续租涨价幅度过大，希望协商调整价格。',
    relatedOrderNo: 'XZ20260510001',
    roomNumber: 'A栋1203室',
    tenantName: '张三',
    tenantPhone: '138****8888',
    status: 'rejected',
    statusText: '已驳回',
    statusColor: '#ee0a24',
    priority: 'normal',
    priorityText: '普通',
    createTime: '2026-05-20 11:00:00',
    estimatedResolveTime: '2026-05-23 18:00:00',
    handler: {
      name: '客服小张',
      role: '租赁专员',
      phone: '400-123-4567'
    },
    images: [],
    statusTracks: [
      {
        status: 'submitted',
        statusText: '工单已提交',
        time: '2026-05-20 11:00:00',
        description: '您的售后工单已成功提交，等待客服受理',
        operator: '系统',
        type: 'system'
      },
      {
        status: 'accepted',
        statusText: '工单已受理',
        time: '2026-05-20 14:00:00',
        description: '客服小张已受理您的工单，正在核实情况',
        operator: '客服小张',
        type: 'customer_service'
      },
      {
        status: 'rejected',
        statusText: '已驳回',
        time: '2026-05-22 10:00:00',
        description: '经核实，续租价格符合合同约定，无法调整。如有其他疑问请继续联系客服。',
        operator: '客服小张',
        type: 'customer_service'
      }
    ],
    vouchers: [],
    serviceRating: 3,
    comment: '结果不太满意，但客服态度还行'
  }
];

const customerService = {
  phone: '400-123-4567',
  serviceTime: '09:00-21:00',
  onlineServiceAvailable: true,
  wechatService: 'rental_service_2026',
  faqs: [
    { q: '售后工单多久处理？', a: '普通工单24小时内受理，紧急工单2小时内响应。' },
    { q: '如何上传补充凭证？', a: '进入工单详情页，点击"补充凭证"区域的上传按钮即可。' },
    { q: '怎么联系客服？', a: '可拨打客服电话、使用在线客服或添加微信客服进行咨询。' },
    { q: '对处理结果不满意怎么办？', a: '可在工单详情页申请升级处理，或拨打客服热线投诉。' }
  ],
  contactTypes: [
    { value: 'consult', text: '咨询' },
    { value: 'complaint', text: '投诉' },
    { value: 'urgent', text: '紧急求助' },
    { value: 'suggestion', text: '建议反馈' }
  ]
};

const orderTypes = [
  { value: 'all', text: '全部类型' },
  { value: 'repair', text: '维修售后' },
  { value: 'refund', text: '退款售后' },
  { value: 'invoice', text: '发票售后' },
  { value: 'renewal', text: '续租售后' },
  { value: 'termination', text: '退租售后' },
  { value: 'other', text: '其他问题' }
];

const statusFilters = [
  { value: 'all', text: '全部状态' },
  { value: 'pending', text: '待处理' },
  { value: 'processing', text: '处理中' },
  { value: 'completed', text: '已完成' },
  { value: 'rejected', text: '已驳回' }
];

const getAfterSalesList = (req, res) => {
  try {
    const { status, type, keyword, page = 1, pageSize = 10 } = req.query;
    let list = [...afterSalesOrders];

    if (status && status !== 'all') {
      list = list.filter(o => o.status === status);
    }

    if (type && type !== 'all') {
      list = list.filter(o => o.type === type);
    }

    if (keyword) {
      const kw = keyword.toLowerCase();
      list = list.filter(o =>
        o.title.toLowerCase().includes(kw) ||
        o.orderNo.toLowerCase().includes(kw) ||
        o.description.toLowerCase().includes(kw)
      );
    }

    const start = (page - 1) * pageSize;
    const end = start + parseInt(pageSize);
    const paginatedList = list.slice(start, end);

    const simplifiedList = paginatedList.map(order => ({
      id: order.id,
      orderNo: order.orderNo,
      type: order.type,
      typeName: order.typeName,
      title: order.title,
      description: order.description,
      status: order.status,
      statusText: order.statusText,
      statusColor: order.statusColor,
      priority: order.priority,
      priorityText: order.priorityText,
      createTime: order.createTime,
      handlerName: order.handler?.name || '',
      voucherCount: order.vouchers?.length || 0
    }));

    res.json({
      code: 200,
      message: 'success',
      data: {
        list: simplifiedList,
        total: list.length,
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        totalPages: Math.ceil(list.length / pageSize),
        types: orderTypes,
        statuses: statusFilters
      }
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '获取售后工单列表失败',
      error: error.message
    });
  }
};

const getAfterSalesDetail = (req, res) => {
  try {
    const { orderId } = req.query;

    if (!orderId) {
      return res.status(400).json({
        code: 400,
        message: '工单ID不能为空'
      });
    }

    const order = afterSalesOrders.find(o => o.id === orderId);

    if (!order) {
      return res.status(404).json({
        code: 404,
        message: '工单不存在'
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
      message: '获取工单详情失败',
      error: error.message
    });
  }
};

const uploadVoucher = (req, res) => {
  try {
    const { orderId, type, url, name, description } = req.body;

    if (!orderId) {
      return res.status(400).json({
        code: 400,
        message: '工单ID不能为空'
      });
    }

    const order = afterSalesOrders.find(o => o.id === orderId);

    if (!order) {
      return res.status(404).json({
        code: 404,
        message: '工单不存在'
      });
    }

    const voucher = {
      id: Date.now(),
      type: type || 'image',
      url: url || `https://picsum.photos/200/200?random=${Date.now()}`,
      name: name || '凭证图片.jpg',
      description: description || '',
      uploadTime: new Date().toLocaleString('zh-CN'),
      uploader: order.tenantName
    };

    order.vouchers.push(voucher);

    const trackItem = {
      status: 'voucher_added',
      statusText: '补充凭证已上传',
      time: new Date().toLocaleString('zh-CN'),
      description: `${order.tenantName}上传了补充凭证：${voucher.name}${description ? '，备注：' + description : ''}`,
      operator: order.tenantName,
      type: 'user'
    };
    order.statusTracks.push(trackItem);

    res.json({
      code: 200,
      message: '凭证上传成功',
      data: {
        voucher,
        statusTrack: trackItem
      }
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '凭证上传失败',
      error: error.message
    });
  }
};

const getCustomerService = (req, res) => {
  try {
    res.json({
      code: 200,
      message: 'success',
      data: customerService
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '获取客服信息失败',
      error: error.message
    });
  }
};

const contactService = (req, res) => {
  try {
    const { orderId, type, content, contact, contactName } = req.body;

    if (!type) {
      return res.status(400).json({
        code: 400,
        message: '联系类型不能为空'
      });
    }

    if (!content || content.trim().length < 5) {
      return res.status(400).json({
        code: 400,
        message: '请详细描述您的问题（至少5个字符）'
      });
    }

    if (!contact) {
      return res.status(400).json({
        code: 400,
        message: '请输入联系方式'
      });
    }

    let message = '';
    let estimatedResponse = '';

    if (type === 'complaint') {
      message = '您的投诉已提交，客服将在24小时内与您联系';
      estimatedResponse = '24小时内';
    } else if (type === 'consult') {
      message = '您的咨询已收到，客服将尽快回复';
      estimatedResponse = '工作时间2小时内';
    } else if (type === 'urgent') {
      message = '您的紧急请求已收到，专人将在1小时内联系您';
      estimatedResponse = '1小时内';
    } else if (type === 'suggestion') {
      message = '感谢您的建议，我们会认真考虑并改进';
      estimatedResponse = '3个工作日内';
    } else {
      message = '消息已发送，请注意查看回复';
      estimatedResponse = '24小时内';
    }

    if (orderId) {
      const order = afterSalesOrders.find(o => o.id === orderId);
      if (order) {
        const trackItem = {
          status: 'user_message',
          statusText: '用户留言',
          time: new Date().toLocaleString('zh-CN'),
          description: `用户留言：${content}`,
          operator: order.tenantName,
          type: 'user'
        };
        order.statusTracks.push(trackItem);
      }
    }

    res.json({
      code: 200,
      message: '发送成功',
      data: {
        message,
        ticketId: 'KF' + Date.now(),
        estimatedResponse,
        contactType: type
      }
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '发送失败',
      error: error.message
    });
  }
};

const submitRating = (req, res) => {
  try {
    const { orderId, rating, comment } = req.body;

    if (!orderId) {
      return res.status(400).json({
        code: 400,
        message: '工单ID不能为空'
      });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        code: 400,
        message: '请给出1-5星评价'
      });
    }

    const order = afterSalesOrders.find(o => o.id === orderId);

    if (!order) {
      return res.status(404).json({
        code: 404,
        message: '工单不存在'
      });
    }

    order.serviceRating = rating;
    order.comment = comment || '';

    const trackItem = {
      status: 'rated',
      statusText: '用户已评价',
      time: new Date().toLocaleString('zh-CN'),
      description: `用户给出${rating}星评价${comment ? '：' + comment : ''}`,
      operator: order.tenantName,
      type: 'user'
    };
    order.statusTracks.push(trackItem);

    res.json({
      code: 200,
      message: '评价提交成功',
      data: {
        rating,
        comment: comment || '',
        statusTrack: trackItem
      }
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '评价提交失败',
      error: error.message
    });
  }
};

const createAfterSales = (req, res) => {
  try {
    const { type, typeName, title, description, relatedOrderNo, images, contactName, contactPhone } = req.body;

    if (!type) {
      return res.status(400).json({
        code: 400,
        message: '请选择售后类型'
      });
    }

    if (!title || title.trim().length < 2) {
      return res.status(400).json({
        code: 400,
        message: '请输入问题标题'
      });
    }

    if (!description || description.trim().length < 10) {
      return res.status(400).json({
        code: 400,
        message: '请详细描述问题（至少10个字符）'
      });
    }

    if (!contactName) {
      return res.status(400).json({
        code: 400,
        message: '请输入联系人姓名'
      });
    }

    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!contactPhone || !phoneRegex.test(contactPhone)) {
      return res.status(400).json({
        code: 400,
        message: '请输入正确的手机号'
      });
    }

    const orderId = 'AS' + Date.now() + Math.floor(Math.random() * 10000);
    const now = new Date();

    const newOrder = {
      id: orderId,
      orderNo: orderId,
      type,
      typeName: typeName || '其他售后',
      title: title.trim(),
      description: description.trim(),
      relatedOrderNo: relatedOrderNo || '',
      roomNumber: 'A栋1203室',
      tenantName: contactName,
      tenantPhone: contactPhone,
      status: 'pending',
      statusText: '待处理',
      statusColor: '#1989fa',
      priority: 'normal',
      priorityText: '普通',
      createTime: now.toLocaleString('zh-CN'),
      estimatedResolveTime: '',
      handler: {
        name: '',
        role: '',
        phone: ''
      },
      images: images || [],
      statusTracks: [
        {
          status: 'submitted',
          statusText: '工单已提交',
          time: now.toLocaleString('zh-CN'),
          description: '您的售后工单已成功提交，等待客服受理',
          operator: '系统',
          type: 'system'
        }
      ],
      vouchers: [],
      serviceRating: null,
      comment: ''
    };

    afterSalesOrders.unshift(newOrder);

    res.json({
      code: 200,
      message: '售后工单提交成功',
      data: {
        orderId,
        orderNo: orderId,
        status: 'pending',
        statusText: '待处理',
        createTime: now.toLocaleString('zh-CN'),
        estimatedResponse: '24小时内'
      }
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '提交售后工单失败',
      error: error.message
    });
  }
};

const uploadImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        code: 400,
        message: '文件内容不能为空，请重新选择文件'
      });
    }

    const file = req.file;
    const isImage = file.mimetype.startsWith('image/');
    const isVideo = file.mimetype.startsWith('video/');

    const maxImageSize = 10 * 1024 * 1024;
    const maxVideoSize = 100 * 1024 * 1024;

    if (isImage && file.size > maxImageSize) {
      return res.status(400).json({
        code: 400,
        message: `图片大小不能超过 10MB，当前文件大小为 ${(file.size / 1024 / 1024).toFixed(2)}MB`
      });
    }

    if (isVideo && file.size > maxVideoSize) {
      return res.status(400).json({
        code: 400,
        message: `视频大小不能超过 100MB，当前文件大小为 ${(file.size / 1024 / 1024).toFixed(2)}MB`
      });
    }

    const url = `/uploads/after-sales/${file.filename}`;

    res.json({
      code: 200,
      message: '上传成功',
      data: {
        url,
        name: file.originalname,
        type: isImage ? 'image' : 'video',
        size: file.size
      }
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: `上传失败：${error.message || '未知错误'}，请检查网络或重新选择文件`
    });
  }
};

const getAfterSalesTypes = (req, res) => {
  try {
    res.json({
      code: 200,
      message: 'success',
      data: {
        types: orderTypes,
        statuses: statusFilters
      }
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '获取售后类型失败',
      error: error.message
    });
  }
};

module.exports = {
  getAfterSalesList,
  getAfterSalesDetail,
  createAfterSales,
  uploadVoucher,
  uploadImage,
  getCustomerService,
  contactService,
  submitRating,
  getAfterSalesTypes
};
