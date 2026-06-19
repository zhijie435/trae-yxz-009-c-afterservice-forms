const orders = require('../models/orders');

const currentContract = {
  roomNumber: 'A栋1203室',
  monthlyRent: 3500,
  deposit: 3500,
  contractStartDate: '2025-08-01',
  contractEndDate: '2026-07-31',
  tenantName: '张三',
  tenantPhone: '138****8888'
};

const getCurrentOrder = () => {
  return orders.find(o => o.roomNumber === currentContract.roomNumber);
};

const getTerminationInfo = (req, res) => {
  try {
    const today = new Date();
    const contractEnd = new Date(currentContract.contractEndDate);
    const diffDays = Math.ceil((contractEnd - today) / (1000 * 60 * 60 * 24));

    const earliestDate = new Date(today);
    earliestDate.setDate(earliestDate.getDate() + 7);

    const latestDate = contractEnd;

    const currentOrder = getCurrentOrder();

    res.json({
      code: 200,
      message: 'success',
      data: {
        orderId: currentOrder ? currentOrder.id : null,
        currentContract,
        daysRemaining: diffDays,
        earliestMoveOutDate: earliestDate.toISOString().split('T')[0],
        latestMoveOutDate: latestDate.toISOString().split('T')[0],
        depositRefundable: currentContract.deposit,
        noticePeriod: 7
      }
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '获取退租信息失败',
      error: error.message
    });
  }
};

const submitTermination = (req, res) => {
  try {
    const { moveOutDate, receiverName, receiverPhone, receiverAddress, expressNumber, remark } = req.body;

    if (!moveOutDate) {
      return res.status(400).json({
        code: 400,
        message: '请选择退租时间'
      });
    }

    if (!receiverName || !receiverPhone || !receiverAddress) {
      return res.status(400).json({
        code: 400,
        message: '请填写完整的收件地址信息'
      });
    }

    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(receiverPhone)) {
      return res.status(400).json({
        code: 400,
        message: '收件人手机号格式不正确'
      });
    }

    const today = new Date();
    const earliest = new Date(today);
    earliest.setDate(earliest.getDate() + 7);
    const latest = new Date(currentContract.contractEndDate);
    const selected = new Date(moveOutDate);

    if (selected < earliest || selected > latest) {
      return res.status(400).json({
        code: 400,
        message: `退租时间需在 ${earliest.toISOString().split('T')[0]} 至 ${latest.toISOString().split('T')[0]} 之间`
      });
    }

    const orderId = 'TZ' + Date.now() + Math.floor(Math.random() * 10000);
    const now = new Date();
    const status = 'pending';

    const currentOrder = getCurrentOrder();
    if (currentOrder) {
      const statusMap = {
        none: { status: 'none', statusText: '未申请' },
        pending: { status: 'pending', statusText: '审核中' },
        approved: { status: 'approved', statusText: '已同意' },
        rejected: { status: 'rejected', statusText: '已拒绝' },
        completed: { status: 'completed', statusText: '已完成' }
      };
      const statusInfo = statusMap[status] || statusMap.none;
      currentOrder.termination.status = statusInfo.status;
      currentOrder.termination.statusText = statusInfo.statusText;
      currentOrder.termination.applicationTime = now.toLocaleString('zh-CN');
      currentOrder.termination.approvedTime = null;
      currentOrder.termination.moveOutDate = moveOutDate;
      currentOrder.termination.refundAmount = currentContract.deposit;
      currentOrder.termination.reason = remark || '';
    }

    res.json({
      code: 200,
      message: '退租申请提交成功',
      data: {
        orderId,
        roomNumber: currentContract.roomNumber,
        tenantName: currentContract.tenantName,
        moveOutDate,
        contractEndDate: currentContract.contractEndDate,
        receiver: {
          name: receiverName,
          phone: receiverPhone,
          address: receiverAddress
        },
        expressNumber: expressNumber || '',
        remark: remark || '',
        depositRefundable: currentContract.deposit,
        status,
        statusText: '待审核',
        submitTime: now.toISOString(),
        estimatedRefundDate: calculateRefundDate(moveOutDate)
      }
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '提交退租申请失败',
      error: error.message
    });
  }
};

function calculateRefundDate(moveOutDate) {
  const date = new Date(moveOutDate);
  date.setDate(date.getDate() + 15);
  return date.toISOString().split('T')[0];
}

module.exports = {
  getTerminationInfo,
  submitTermination
};
