import request from './rental';

export const getOrderList = () => {
  return request.get('/order/list');
};

export const getOrderDetail = (orderId) => {
  return request.get('/order/detail', {
    params: { orderId }
  });
};

export const updateRenewalStatus = (data) => {
  return request.post('/order/renewal-status', data);
};

export const updateTerminationStatus = (data) => {
  return request.post('/order/termination-status', data);
};

export const updateRepairStatus = (data) => {
  return request.post('/order/repair-status', data);
};

export default request;
