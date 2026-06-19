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
