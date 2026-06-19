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

const getRentalDurations = (req, res) => {
  try {
    res.json({
      code: 200,
      message: 'success',
      data: {
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

module.exports = {
  getRentalDurations,
  calculateRentalFee,
  submitPayment
};
