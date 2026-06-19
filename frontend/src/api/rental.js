import axios from 'axios';

const request = axios.create({
  baseURL: '/api',
  timeout: 10000
});

export const getRentalDurations = () => {
  return request.get('/rental/durations');
};

export const calculateRentalFee = (data) => {
  return request.post('/rental/calculate', data);
};

export const submitPayment = (data) => {
  return request.post('/rental/submit', data);
};

export default request;
