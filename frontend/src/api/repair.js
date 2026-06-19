import request from './rental';

export const getRepairInfo = () => {
  return request.get('/repair/info');
};

export const submitRepair = (data) => {
  return request.post('/repair/submit', data);
};

export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append('file', file);

  return request.post('/repair/upload-image', formData, {
    timeout: 30000
  }).then((res) => {
    if (res.data.code === 200) {
      return {
        url: res.data.data.url,
        name: res.data.data.name,
        type: res.data.data.type
      };
    }
    throw new Error(res.data.message || '上传失败');
  }).catch((err) => {
    if (err.response && err.response.data && err.response.data.message) {
      throw new Error(err.response.data.message);
    }
    if (err.code === 'ECONNABORTED') {
      throw new Error('上传超时，请检查网络后重试');
    }
    if (err.message) {
      throw new Error(err.message);
    }
    throw new Error('网络错误，请检查网络连接后重试');
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
