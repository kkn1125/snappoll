import { snapApi } from '@/apis';

export const getVoteResponseMe = async () => {
  const { data } = await snapApi.get('/votes/me/response');
  return data;
};
