import request from './rental';

export const getTerminationInfo = () => {
  return request.get('/termination/info');
};

export const submitTermination = (data) => {
  return request.post('/termination/submit', data);
};
