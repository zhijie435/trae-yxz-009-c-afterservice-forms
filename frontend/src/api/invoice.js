import request from './rental';

export const getInvoiceOrders = () => {
  return request.get('/invoice/orders');
};

export const getInvoiceTitles = () => {
  return request.get('/invoice/titles');
};

export const getAddressList = () => {
  return request.get('/invoice/addresses');
};

export const submitInvoiceApplication = (data) => {
  return request.post('/invoice/submit', data);
};

export default request;
