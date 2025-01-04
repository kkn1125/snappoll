import { snapApi } from '@apis/index';

export const getPlansView = async (page: number = 1) => {
  const { data } = await snapApi.get('/plans/view', {
    params: { page: '' + page },
  });
  return data;
};
