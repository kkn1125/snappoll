import { snapApi } from '..';

export const getNotices = async () => {
  const { data } = await snapApi.get('/notices');
  return data;
};
