import { snapApi } from '@apis/index';

export const getPlans = async () => {
  const { data } = await snapApi.get('/plans');
  return data;
};
