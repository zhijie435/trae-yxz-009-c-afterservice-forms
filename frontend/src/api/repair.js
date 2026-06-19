import request from './rental';

export const getRepairInfo = () => {
  return request.get('/repair/info');
};

export const submitRepair = (data) => {
  return request.post('/repair/submit', data);
};

export const uploadImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error('文件读取失败，可能是文件已损坏或不支持该格式'));
    };

    reader.onload = async (e) => {
      try {
        const fileData = e.target.result;
        const res = await request.post('/repair/upload-image', {
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          fileData
        }, {
          timeout: 30000
        });

        if (res.data.code === 200) {
          resolve({
            url: res.data.data.url,
            name: res.data.data.name,
            type: res.data.data.type
          });
        } else {
          reject(new Error(res.data.message || '上传失败'));
        }
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
          reject(new Error(err.response.data.message));
        } else if (err.code === 'ECONNABORTED') {
          reject(new Error('上传超时，请检查网络后重试'));
        } else if (err.message) {
          reject(new Error(err.message));
        } else {
          reject(new Error('网络错误，请检查网络连接后重试'));
        }
      }
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
