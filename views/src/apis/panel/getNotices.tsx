import { snapApi } from '..';

export const getNotices = async (page: number = 1) => {
  const { data } = await snapApi.get('/notices', {
    params: { page },
  });
  return data;
};
