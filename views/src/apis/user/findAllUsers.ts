import { snapApi } from '@apis/index';

export const findAllUsers = async () => {
  const { data } = await snapApi.get('/users');
  return data;
};
