import { ref } from 'vue';
import { showToast, showLoadingToast, closeToast } from 'vant';
import {
  updateRenewalStatus,
  updateTerminationStatus,
  updateRepairStatus
} from '../api/order';
import { updateInvoiceStatus } from '../api/invoice';
import {
  getStatusColor,
  getStatusText,
  getStatusOptions
} from '../utils/orderStatus';

export function useOrderStatus() {
  const loading = ref(false);
  const selectedRepairId = ref(null);

  const renewalStatusOptions = getStatusOptions('renewal');
  const terminationStatusOptions = getStatusOptions('termination');
  const repairStatusOptions = getStatusOptions('repair');
  const invoiceStatusOptions = getStatusOptions('invoice');

  const getRenewalStatusColor = (status) => getStatusColor('renewal', status);
  const getTerminationStatusColor = (status) => getStatusColor('termination', status);
  const getRepairStatusColor = (status) => getStatusColor('repair', status);
  const getInvoiceStatusColor = (status) => getStatusColor('invoice', status);

  const getRenewalStatusText = (status) => getStatusText('renewal', status);
  const getTerminationStatusText = (status) => getStatusText('termination', status);
  const getRepairStatusText = (status) => getStatusText('repair', status);
  const getInvoiceStatusText = (status) => getStatusText('invoice', status);

  const handleUpdateStatus = async (type, params, updateCallback) => {
    loading.value = true;
    showLoadingToast({
      message: '更新中...',
      forbidClick: true,
      duration: 0
    });

    try {
      const result = await updateCallback(params);
      closeToast();

      if (result.data.code === 200) {
        showToast(`${type}状态更新成功`);
        return result.data.data;
      } else {
        showToast(result.data.message || '更新失败');
        return null;
      }
    } catch (error) {
      closeToast();
      showToast('网络错误，请稍后重试');
      return null;
    } finally {
      loading.value = false;
    }
  };

  const handleUpdateRenewalStatus = async (orderId, status, options = {}) => {
    return await handleUpdateStatus('续租', {
      orderId,
      status,
      startDate: options.startDate || '2026-08-01',
      endDate: options.endDate || '2027-01-31',
      monthlyRent: options.monthlyRent || 3500,
      discount: options.discount ?? ((status === 'approved' || status === 'completed') ? 5 : 0)
    }, updateRenewalStatus);
  };

  const handleUpdateTerminationStatus = async (orderId, status, options = {}) => {
    return await handleUpdateStatus('退租', {
      orderId,
      status,
      moveOutDate: options.moveOutDate || '2026-06-30',
      refundAmount: options.refundAmount ?? ((status === 'approved' || status === 'completed') ? 3500 : null),
      reason: options.reason || '工作调动'
    }, updateTerminationStatus);
  };

  const handleUpdateRepairStatus = async (orderId, repairId, status, options = {}) => {
    if (!repairId) {
      showToast('请选择报修单');
      return null;
    }

    return await handleUpdateStatus('报修', {
      orderId,
      repairId,
      status,
      workerName: options.workerName || '张师傅',
      workerPhone: options.workerPhone || '138****6666',
      fee: options.fee ?? 200
    }, updateRepairStatus);
  };

  const handleUpdateInvoiceStatus = async (orderIds, status, options = {}) => {
    if (!orderIds || orderIds.length === 0) {
      showToast('请选择订单');
      return null;
    }

    return await handleUpdateStatus('发票', {
      orderIds: Array.isArray(orderIds) ? orderIds : [orderIds],
      status,
      invoiceId: options.invoiceId || 'FP' + Date.now(),
      expressNumber: options.expressNumber
    }, updateInvoiceStatus);
  };

  const updateOrderState = (order, type, data) => {
    if (!order) return;

    switch (type) {
      case 'renewal':
        if (data?.renewal) {
          order.renewal = data.renewal;
        }
        break;
      case 'termination':
        if (data?.termination) {
          order.termination = data.termination;
        }
        if (data?.status) {
          order.status = data.status;
          order.statusText = data.statusText;
        }
        break;
      case 'repair':
        if (data?.repair && order.repairs) {
          const idx = order.repairs.findIndex(r => r.id === data.repair.id);
          if (idx !== -1) {
            order.repairs[idx] = data.repair;
          }
        }
        break;
      case 'invoice':
        if (data?.orders) {
          order.hasInvoice = data.orders[0]?.hasInvoice || order.hasInvoice;
          if (!order.invoices) {
            order.invoices = [];
          }
          if (data.orders[0]?.invoices) {
            order.invoices = data.orders[0].invoices;
          }
        }
        break;
    }
  };

  return {
    loading,
    selectedRepairId,
    renewalStatusOptions,
    terminationStatusOptions,
    repairStatusOptions,
    invoiceStatusOptions,
    getRenewalStatusColor,
    getTerminationStatusColor,
    getRepairStatusColor,
    getInvoiceStatusColor,
    getRenewalStatusText,
    getTerminationStatusText,
    getRepairStatusText,
    getInvoiceStatusText,
    handleUpdateRenewalStatus,
    handleUpdateTerminationStatus,
    handleUpdateRepairStatus,
    handleUpdateInvoiceStatus,
    updateOrderState
  };
}
