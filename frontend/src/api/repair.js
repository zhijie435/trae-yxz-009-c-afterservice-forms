import request from './rental';

export const getRepairInfo = () => {
  return request.get('/repair/info');
};

export const submitRepair = (data) => {
  return request.post('/repair/submit', data);
};

export const uploadImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setTimeout(() => {
        resolve({
          url: e.target.result,
          name: file.name
        });
      }, 500);
    };
    reader.readAsDataURL(file);
  });
};

export const getRepairOrderList = (status) => {
  return request.get('/repair/orders', { params: { status } });
};

export const getRepairOrderDetail = (orderId) => {
  return request.get('/repair/order-detail', { params: { orderId } });
};

export const uploadVoucher = (data) => {
  return request.post('/repair/upload-voucher', data);
};

export const getCustomerService = () => {
  return request.get('/repair/customer-service');
};

export const contactService = (data) => {
  return request.post('/repair/contact-service', data);
};

export const submitRating = (data) => {
  return request.post('/repair/rating', data);
};
