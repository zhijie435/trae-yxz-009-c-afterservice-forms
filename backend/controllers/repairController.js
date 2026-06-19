const repairOrders = [
  {
    id: 'BX20260115001',
    orderNo: 'BX20260115001',
    type: 'appliance',
    typeName: '家具家电',
    subTypeName: '空调维修',
    description: '空调不制冷，开机后只有风没有冷气，已经持续2天了。',
    images: [
      'https://picsum.photos/200/200?random=1',
      'https://picsum.photos/200/200?random=2'
    ],
    roomNumber: 'A栋1203室',
    tenantName: '张三',
    tenantPhone: '138****8888',
    appointmentTime: '工作日 09:00-12:00',
    status: 'completed',
    statusText: '已完成',
    statusColor: '#07c160',
    createTime: '2026-01-15 14:30:00',
    worker: {
      name: '李师傅',
      phone: '139****1234',
      avatar: '',
      skill: '空调维修专家'
    },
    fee: 180,
    feeDetail: [
      { name: '上门服务费', amount: 50 },
      { name: '零配件费', amount: 100 },
      { name: '人工费', amount: 30 }
    ],
    guaranteeDays: 90,
    statusTracks: [
      {
        status: 'submitted',
        statusText: '工单已提交',
        time: '2026-01-15 14:30:00',
        description: '您的报修工单已成功提交，等待分配处理人员',
        operator: '系统'
      },
      {
        status: 'dispatched',
        statusText: '工单已派单',
        time: '2026-01-15 15:00:00',
        description: '工单已分配给李师傅，预计24小时内上门处理',
        operator: '客服小王'
      },
      {
        status: 'arrived',
        statusText: '维修人员已到达',
        time: '2026-01-16 09:30:00',
        description: '李师傅已到达现场，开始检查维修',
        operator: '李师傅'
      },
      {
        status: 'repairing',
        statusText: '维修中',
        time: '2026-01-16 10:15:00',
        description: '经检测为压缩机故障，正在更换配件',
        operator: '李师傅'
      },
      {
        status: 'completed',
        statusText: '维修完成',
        time: '2026-01-16 11:45:00',
        description: '空调已修复，制冷正常。保修90天',
        operator: '李师傅'
      }
    ],
    vouchers: [
      {
        id: 1,
        type: 'image',
        url: 'https://picsum.photos/200/200?random=3',
        name: '空调铭牌.jpg',
        uploadTime: '2026-01-15 14:35:00',
        uploader: '张三'
      }
    ],
    serviceRating: null,
    comment: ''
  },
  {
    id: 'BX20260220002',
    orderNo: 'BX20260220002',
    type: 'plumbing',
    typeName: '水电维修',
    subTypeName: '水龙头更换',
    description: '厨房水龙头漏水，关不紧，水一直滴。',
    images: [
      'https://picsum.photos/200/200?random=4'
    ],
    roomNumber: 'A栋1203室',
    tenantName: '张三',
    tenantPhone: '138****8888',
    appointmentTime: '周末 14:00-18:00',
    status: 'in_progress',
    statusText: '维修中',
    statusColor: '#ff976a',
    createTime: '2026-02-20 09:15:00',
    worker: {
      name: '王师傅',
      phone: '138****5678',
      avatar: '',
      skill: '水电维修'
    },
    fee: 120,
    feeDetail: [
      { name: '上门服务费', amount: 50 },
      { name: '水龙头配件', amount: 70 }
    ],
    guaranteeDays: 90,
    statusTracks: [
      {
        status: 'submitted',
        statusText: '工单已提交',
        time: '2026-02-20 09:15:00',
        description: '您的报修工单已成功提交，等待分配处理人员',
        operator: '系统'
      },
      {
        status: 'dispatched',
        statusText: '工单已派单',
        time: '2026-02-20 09:45:00',
        description: '工单已分配给王师傅，预计48小时内上门处理',
        operator: '客服小李'
      },
      {
        status: 'arrived',
        statusText: '维修人员已到达',
        time: '2026-02-22 15:00:00',
        description: '王师傅已到达现场，开始检查维修',
        operator: '王师傅'
      },
      {
        status: 'repairing',
        statusText: '维修中',
        time: '2026-02-22 15:30:00',
        description: '正在更换新的水龙头',
        operator: '王师傅'
      }
    ],
    vouchers: [],
    serviceRating: null,
    comment: ''
  }
];

const customerService = {
  phone: '400-123-4567',
  serviceTime: '09:00-21:00',
  onlineServiceAvailable: true,
  wechatService: 'rental_service_2026',
  faqs: [
    { q: '报修后多久上门？', a: '一般故障24小时内上门，紧急故障2小时内响应。' },
    { q: '维修费用怎么算？', a: '非人为损坏免费，人为损坏需承担配件费和人工费。' },
    { q: '维修有保修吗？', a: '所有维修项目均享受90天质保期。' }
  ]
};

const faultTypes = [
  { id: 1, name: '水电维修', icon: 'water-o', subTypes: [
    { id: '1-1', name: '水龙头漏水' },
    { id: '1-2', name: '下水道堵塞' },
    { id: '1-3', name: '灯具损坏' },
    { id: '1-4', name: '电路故障' }
  ]},
  { id: 2, name: '家具家电', icon: 'tv-o', subTypes: [
    { id: '2-1', name: '空调故障' },
    { id: '2-2', name: '洗衣机故障' },
    { id: '2-3', name: '冰箱故障' },
    { id: '2-4', name: '热水器故障' },
    { id: '2-5', name: '桌椅家具损坏' }
  ]},
  { id: 3, name: '门窗锁具', icon: 'gold-coin-o', subTypes: [
    { id: '3-1', name: '门锁故障' },
    { id: '3-2', name: '窗户损坏' },
    { id: '3-3', name: '窗帘问题' }
  ]},
  { id: 4, name: '墙面地面', icon: 'photo-o', subTypes: [
    { id: '4-1', name: '墙面掉皮' },
    { id: '4-2', name: '地砖/地板损坏' },
    { id: '4-3', name: '天花板漏水' }
  ]},
  { id: 5, name: '其他问题', icon: 'other-o', subTypes: [
    { id: '5-1', name: '清洁服务' },
    { id: '5-2', name: '其他问题' }
  ]}
];

const currentContract = {
  roomNumber: 'A栋1203室',
  tenantName: '张三',
  tenantPhone: '138****8888'
};

const getRepairInfo = (req, res) => {
  try {
    res.json({
      code: 200,
      message: 'success',
      data: {
        faultTypes,
        currentContract,
        maxImages: 9,
        maxVideoDuration: 60
      }
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '获取报修信息失败',
      error: error.message
    });
  }
};

const submitRepair = (req, res) => {
  try {
    const { faultTypeId, faultSubTypeId, faultTypeName, faultSubTypeName, description, images, contactName, contactPhone, appointmentTime } = req.body;

    if (!faultTypeId || !faultSubTypeId) {
      return res.status(400).json({
        code: 400,
        message: '请选择故障类型'
      });
    }

    if (!description || description.trim().length < 5) {
      return res.status(400).json({
        code: 400,
        message: '请详细描述故障问题（至少5个字符）'
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
        message: '联系人手机号格式不正确'
      });
    }

    const orderId = 'BX' + Date.now() + Math.floor(Math.random() * 10000);
    const now = new Date();
    const status = 'pending';

    let estimatedTime = '';
    if (faultTypeId === 1) {
      estimatedTime = '24小时内上门';
    } else if (faultTypeId === 2) {
      estimatedTime = '48小时内上门';
    } else {
      estimatedTime = '1-3个工作日内上门';
    }

    res.json({
      code: 200,
      message: '报修工单提交成功',
      data: {
        orderId,
        roomNumber: currentContract.roomNumber,
        tenantName: currentContract.tenantName,
        faultTypeId,
        faultSubTypeId,
        faultTypeName,
        faultSubTypeName,
        description,
        images: images || [],
        contactName,
        contactPhone,
        appointmentTime: appointmentTime || '',
        status,
        statusText: '待处理',
        submitTime: now.toISOString(),
        estimatedArrivalTime: estimatedTime,
        serviceFee: '免费（非人为损坏）',
        workerInfo: {
          name: '待分配',
          phone: ''
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '提交报修工单失败',
      error: error.message
    });
  }
};

const getRepairOrderDetail = (req, res) => {
  try {
    const { orderId } = req.query;

    if (!orderId) {
      return res.status(400).json({
        code: 400,
        message: '工单ID不能为空'
      });
    }

    const order = repairOrders.find(o => o.id === orderId);

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

const getRepairOrderList = (req, res) => {
  try {
    const { status } = req.query;
    let list = repairOrders;

    if (status && status !== 'all') {
      list = repairOrders.filter(o => o.status === status);
    }

    const simplifiedList = list.map(order => ({
      id: order.id,
      orderNo: order.orderNo,
      typeName: order.typeName,
      subTypeName: order.subTypeName,
      description: order.description,
      status: order.status,
      statusText: order.statusText,
      statusColor: order.statusColor,
      roomNumber: order.roomNumber,
      createTime: order.createTime,
      workerName: order.worker?.name || '',
      fee: order.fee
    }));

    res.json({
      code: 200,
      message: 'success',
      data: {
        list: simplifiedList,
        total: simplifiedList.length
      }
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '获取工单列表失败',
      error: error.message
    });
  }
};

const uploadVoucher = (req, res) => {
  try {
    const { orderId, type, url, name } = req.body;

    if (!orderId) {
      return res.status(400).json({
        code: 400,
        message: '工单ID不能为空'
      });
    }

    const order = repairOrders.find(o => o.id === orderId);

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
      uploadTime: new Date().toLocaleString('zh-CN'),
      uploader: order.tenantName
    };

    order.vouchers.push(voucher);

    const trackItem = {
      status: 'voucher_added',
      statusText: '补充凭证已上传',
      time: new Date().toLocaleString('zh-CN'),
      description: `用户上传了补充凭证：${voucher.name}`,
      operator: order.tenantName
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
    const { orderId, type, content, contact } = req.body;

    if (!type) {
      return res.status(400).json({
        code: 400,
        message: '联系类型不能为空'
      });
    }

    let message = '';
    if (type === 'complaint') {
      message = '您的投诉已提交，客服将在24小时内与您联系';
    } else if (type === 'consult') {
      message = '您的咨询已收到，客服将尽快回复';
    } else if (type === 'urgent') {
      message = '您的紧急请求已收到，专人将在1小时内联系您';
    } else {
      message = '消息已发送，请注意查看回复';
    }

    res.json({
      code: 200,
      message: '发送成功',
      data: {
        message,
        ticketId: 'KF' + Date.now(),
        estimatedResponse: type === 'urgent' ? '1小时内' : '24小时内'
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

    const order = repairOrders.find(o => o.id === orderId);

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
      operator: order.tenantName
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

const uploadImage = (req, res) => {
  try {
    const { fileName, fileType, fileSize, fileData } = req.body;

    if (!fileName) {
      return res.status(400).json({
        code: 400,
        message: '文件名不能为空'
      });
    }

    if (!fileType) {
      return res.status(400).json({
        code: 400,
        message: '文件类型不能为空'
      });
    }

    if (!fileData) {
      return res.status(400).json({
        code: 400,
        message: '文件内容不能为空，请重新选择文件'
      });
    }

    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    const isImage = allowedImageTypes.includes(fileType);
    const isVideo = allowedVideoTypes.includes(fileType);

    if (!isImage && !isVideo) {
      const typeMap = {
        'image/jpeg': 'JPG',
        'image/jpg': 'JPG',
        'image/png': 'PNG',
        'image/gif': 'GIF',
        'image/webp': 'WEBP',
        'image/bmp': 'BMP',
        'video/mp4': 'MP4',
        'video/webm': 'WEBM',
        'video/ogg': 'OGG',
        'video/quicktime': 'MOV'
      };
      return res.status(400).json({
        code: 400,
        message: `不支持的文件格式（${fileType || '未知格式'}），仅支持 JPG、PNG、GIF、WEBP 图片和 MP4 视频`
      });
    }

    const maxImageSize = 10 * 1024 * 1024;
    const maxVideoSize = 100 * 1024 * 1024;

    if (isImage && fileSize > maxImageSize) {
      return res.status(400).json({
        code: 400,
        message: `图片大小不能超过 10MB，当前文件大小为 ${(fileSize / 1024 / 1024).toFixed(2)}MB`
      });
    }

    if (isVideo && fileSize > maxVideoSize) {
      return res.status(400).json({
        code: 400,
        message: `视频大小不能超过 100MB，当前文件大小为 ${(fileSize / 1024 / 1024).toFixed(2)}MB`
      });
    }

    if (!fileSize || fileSize <= 0) {
      return res.status(400).json({
        code: 400,
        message: '文件大小为 0，可能是文件已损坏或未正确读取'
      });
    }

    if (isImage && fileSize < 1024) {
      return res.status(400).json({
        code: 400,
        message: '图片文件过小，可能是文件已损坏，请重新选择清晰的图片'
      });
    }

    const fileExtension = fileName.split('.').pop().toLowerCase();
    const validImageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];
    const validVideoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'qt'];
    if (isImage && !validImageExtensions.includes(fileExtension)) {
      return res.status(400).json({
        code: 400,
        message: `图片文件后缀名不匹配（.${fileExtension}），请检查文件格式是否正确`
      });
    }
    if (isVideo && !validVideoExtensions.includes(fileExtension)) {
      return res.status(400).json({
        code: 400,
        message: `视频文件后缀名不匹配（.${fileExtension}），请检查文件格式是否正确`
      });
    }

    const errorRate = 0.05;
    if (Math.random() < errorRate) {
      const errors = [
        '服务器存储空间不足，请稍后重试或联系客服',
        '上传通道繁忙，请稍后重试',
        '网络连接中断，请检查网络后重试',
        '文件读取超时，请重新选择文件上传'
      ];
      return res.status(500).json({
        code: 500,
        message: errors[Math.floor(Math.random() * errors.length)]
      });
    }

    const url = `https://picsum.photos/seed/${Date.now()}/${isVideo ? 400 : 600}/${isVideo ? 300 : 600}`;

    setTimeout(() => {
      res.json({
        code: 200,
        message: '上传成功',
        data: {
          url,
          name: fileName,
          type: isImage ? 'image' : 'video',
          size: fileSize
        }
      });
    }, 300 + Math.random() * 500);

  } catch (error) {
    res.status(500).json({
      code: 500,
      message: `上传失败：${error.message || '未知错误'}，请检查网络或重新选择文件`
    });
  }
};

module.exports = {
  getRepairInfo,
  submitRepair,
  getRepairOrderList,
  getRepairOrderDetail,
  uploadImage,
  uploadVoucher,
  getCustomerService,
  contactService,
  submitRating
};
