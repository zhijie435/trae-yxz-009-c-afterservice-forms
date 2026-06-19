const {
  findOrder,
  updateTerminationStatus,
  handleError
} = require('../utils/orderStatusManager');

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
  return findOrder('HT202601001');
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
    handleError(res, error, '获取退租信息失败');
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

    const currentOrder = getCurrentOrder();
    if (currentOrder) {
      updateTerminationStatus(currentOrder.id, 'pending', {
        moveOutDate,
        refundAmount: currentContract.deposit,
        reason: remark || ''
      });
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
        status: 'pending',
        statusText: '待审核',
        submitTime: now.toISOString(),
        estimatedRefundDate: calculateRefundDate(moveOutDate)
      }
    });
  } catch (error) {
    handleError(res, error, '提交退租申请失败');
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
