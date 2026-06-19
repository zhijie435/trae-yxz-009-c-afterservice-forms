const orders = require('../models/orders');

const rentalDurations = [
  { id: 1, months: 1, label: '1个月', discount: 0 },
  { id: 2, months: 3, label: '3个月', discount: 0.05 },
  { id: 3, months: 6, label: '6个月', discount: 0.1 },
  { id: 4, months: 12, label: '12个月', discount: 0.15 }
];

const currentContract = {
  roomNumber: 'A栋1203室',
  monthlyRent: 3500,
  propertyFee: 200,
  waterFee: 50,
  electricityFee: 150,
  contractEndDate: '2026-07-31'
};

const getCurrentOrder = () => {
  return orders.find(o => o.roomNumber === currentContract.roomNumber);
};

const getRentalDurations = (req, res) => {
  try {
    const currentOrder = getCurrentOrder();
    res.json({
      code: 200,
      message: 'success',
      data: {
        orderId: currentOrder ? currentOrder.id : null,
        durations: rentalDurations,
        currentContract: currentContract
      }
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '获取续租时长失败',
      error: error.message
    });
  }
};

const calculateRentalFee = (req, res) => {
  try {
    const { durationId, startDate } = req.body;

    if (!durationId) {
      return res.status(400).json({
        code: 400,
        message: '请选择续租时长'
      });
    }

    const duration = rentalDurations.find(d => d.id === durationId);
    if (!duration) {
      return res.status(400).json({
        code: 400,
        message: '无效的续租时长'
      });
    }

    const monthlyRent = currentContract.monthlyRent;
    const propertyFee = currentContract.propertyFee;
    const months = duration.months;
    const discount = duration.discount;

    const baseRent = monthlyRent * months;
    const discountedRent = baseRent * (1 - discount);
    const totalPropertyFee = propertyFee * months;
    const deposit = monthlyRent;
    const totalAmount = discountedRent + totalPropertyFee + deposit;

    const breakdown = {
      monthlyRent,
      propertyFee,
      months,
      discount: discount * 100,
      baseRent,
      discountedRent,
      totalPropertyFee,
      deposit,
      totalAmount,
      startDate: startDate || currentContract.contractEndDate,
      endDate: calculateEndDate(startDate || currentContract.contractEndDate, months)
    };

    res.json({
      code: 200,
      message: '计算成功',
      data: breakdown
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '费用计算失败',
      error: error.message
    });
  }
};

const submitPayment = (req, res) => {
  try {
    const { durationId, startDate, paymentMethod, feeBreakdown } = req.body;

    if (!durationId || !paymentMethod || !feeBreakdown) {
      return res.status(400).json({
        code: 400,
        message: '参数不完整'
      });
    }

    const duration = rentalDurations.find(d => d.id === durationId);
    if (!duration) {
      return res.status(400).json({
        code: 400,
        message: '无效的续租时长'
      });
    }

    const orderId = 'ZL' + Date.now() + Math.floor(Math.random() * 10000);
    const paymentStatus = 'pending';
    const expireTime = new Date(Date.now() + 30 * 60 * 1000).toISOString();
    const now = new Date();

    const currentOrder = getCurrentOrder();
    if (currentOrder) {
      const statusMap = {
        none: { status: 'none', statusText: '未申请' },
        pending: { status: 'pending', statusText: '审核中' },
        approved: { status: 'approved', statusText: '已同意' },
        rejected: { status: 'rejected', statusText: '已拒绝' },
        completed: { status: 'completed', statusText: '已完成' }
      };
      const statusInfo = statusMap.pending;
      currentOrder.renewal.status = statusInfo.status;
      currentOrder.renewal.statusText = statusInfo.statusText;
      currentOrder.renewal.applicationTime = now.toLocaleString('zh-CN');
      currentOrder.renewal.approvedTime = null;
      currentOrder.renewal.newStartDate = startDate || currentContract.contractEndDate;
      currentOrder.renewal.newEndDate = calculateEndDate(startDate || currentContract.contractEndDate, duration.months);
      currentOrder.renewal.newMonthlyRent = feeBreakdown.monthlyRent * (1 - duration.discount);
      currentOrder.renewal.discount = duration.discount * 100;
    }

    res.json({
      code: 200,
      message: '提交成功',
      data: {
        orderId,
        roomNumber: currentContract.roomNumber,
        duration: duration.label,
        months: duration.months,
        startDate: startDate || currentContract.contractEndDate,
        endDate: calculateEndDate(startDate || currentContract.contractEndDate, duration.months),
        totalAmount: feeBreakdown.totalAmount,
        paymentMethod,
        paymentStatus,
        expireTime,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${orderId}`
      }
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '提交支付失败',
      error: error.message
    });
  }
};

function calculateEndDate(startDate, months) {
  const date = new Date(startDate);
  date.setMonth(date.getMonth() + months);
  date.setDate(date.getDate() - 1);
  return date.toISOString().split('T')[0];
}

const confirmRenewalPayment = (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        code: 400,
        message: '订单ID不能为空'
      });
    }

    const currentOrder = getCurrentOrder();
    if (!currentOrder) {
      return res.status(404).json({
        code: 404,
        message: '订单不存在'
      });
    }

    const now = new Date();
    currentOrder.renewal.status = 'completed';
    currentOrder.renewal.statusText = '已完成';
    currentOrder.renewal.approvedTime = now.toLocaleString('zh-CN');

    res.json({
      code: 200,
      message: '支付成功',
      data: {
        orderId: currentOrder.id,
        renewal: currentOrder.renewal
      }
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '确认支付失败',
      error: error.message
    });
  }
};

module.exports = {
  getRentalDurations,
  calculateRentalFee,
  submitPayment,
  confirmRenewalPayment
};
