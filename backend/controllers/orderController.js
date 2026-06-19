const orders = require('../models/orders');
const {
  validateOrderExists,
  updateRenewalStatus: updateRenewal,
  updateTerminationStatus: updateTermination,
  updateRepairStatus: updateRepair,
  handleError
} = require('../utils/orderStatusManager');

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
    handleError(res, error, '获取订单列表失败');
  }
};

const getOrderDetail = (req, res) => {
  try {
    const { orderId } = req.query;
    const order = validateOrderExists(orderId, res);
    if (!order) return;

    res.json({
      code: 200,
      message: 'success',
      data: order
    });
  } catch (error) {
    handleError(res, error, '获取订单详情失败');
  }
};

const updateRenewalStatus = (req, res) => {
  try {
    const { orderId, status, startDate, endDate, monthlyRent, discount } = req.body;
    const order = validateOrderExists(orderId, res);
    if (!order) return;

    const updatedOrder = updateRenewal(orderId, status, {
      startDate,
      endDate,
      monthlyRent,
      discount
    });

    if (!updatedOrder) {
      return res.status(400).json({
        code: 400,
        message: '无效的状态值'
      });
    }

    res.json({
      code: 200,
      message: '续租状态更新成功',
      data: {
        orderId: updatedOrder.id,
        renewal: updatedOrder.renewal
      }
    });
  } catch (error) {
    handleError(res, error, '更新续租状态失败');
  }
};

const updateTerminationStatus = (req, res) => {
  try {
    const { orderId, status, moveOutDate, refundAmount, reason } = req.body;
    const order = validateOrderExists(orderId, res);
    if (!order) return;

    const updatedOrder = updateTermination(orderId, status, {
      moveOutDate,
      refundAmount,
      reason
    });

    if (!updatedOrder) {
      return res.status(400).json({
        code: 400,
        message: '无效的状态值'
      });
    }

    res.json({
      code: 200,
      message: '退租状态更新成功',
      data: {
        orderId: updatedOrder.id,
        status: updatedOrder.status,
        statusText: updatedOrder.statusText,
        termination: updatedOrder.termination
      }
    });
  } catch (error) {
    handleError(res, error, '更新退租状态失败');
  }
};

const updateRepairStatus = (req, res) => {
  try {
    const { orderId, repairId, status, workerName, workerPhone, fee, comment } = req.body;

    if (!repairId) {
      return res.status(400).json({
        code: 400,
        message: '报修ID不能为空'
      });
    }

    const order = validateOrderExists(orderId, res);
    if (!order) return;

    const result = updateRepair(orderId, repairId, status, {
      workerName,
      workerPhone,
      fee,
      comment
    });

    if (!result) {
      return res.status(400).json({
        code: 400,
        message: '无效的状态值'
      });
    }

    if (!result.repair) {
      return res.status(404).json({
        code: 404,
        message: '报修记录不存在'
      });
    }

    res.json({
      code: 200,
      message: '报修状态更新成功',
      data: {
        orderId: result.order.id,
        repair: result.repair
      }
    });
  } catch (error) {
    handleError(res, error, '更新报修状态失败');
  }
};

module.exports = {
  getOrderList,
  getOrderDetail,
  updateRenewalStatus,
  updateTerminationStatus,
  updateRepairStatus
};
