import { snapApi } from '@apis/index';

export const getPollResponseMe = async (page: number = 1) => {
  const { data } = await snapApi.get(`/polls/me/response`, {
    params: { page: '' + page },
  });
  return data;
};
