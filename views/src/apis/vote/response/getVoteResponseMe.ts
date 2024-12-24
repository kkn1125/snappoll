import { snapApi } from '@apis/index';

export const getVoteResponseMe = async (page: number = 1) => {
  const { data } = await snapApi.get('/votes/me/response', {
    params: { page: '' + page },
  });
  return data;
};
