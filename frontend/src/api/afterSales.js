import request from './rental';

export const getAfterSalesList = (params) => {
  return request.get('/after-sales/list', { params });
};

export const getAfterSalesDetail = (orderId) => {
  return request.get('/after-sales/detail', {
    params: { orderId }
  });
};

export const createAfterSales = (data) => {
  return request.post('/after-sales/create', data);
};

export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append('file', file);

  return request.post('/after-sales/upload-image', formData, {
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

export const uploadVoucher = (data) => {
  return request.post('/after-sales/upload-voucher', data);
};

export const getCustomerService = () => {
  return request.get('/after-sales/customer-service');
};

export const contactService = (data) => {
  return request.post('/after-sales/contact-service', data);
};

export const submitRating = (data) => {
  return request.post('/after-sales/rating', data);
};

export const getAfterSalesTypes = () => {
  return request.get('/after-sales/types');
};
