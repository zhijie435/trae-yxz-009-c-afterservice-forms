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

module.exports = {
  getRepairInfo,
  submitRepair
};
