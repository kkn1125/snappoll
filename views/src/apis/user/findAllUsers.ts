import { snapApi } from '..';

export const findAllUsers = async () => {
  const { data } = await snapApi.get('/users');
  return data;
};
