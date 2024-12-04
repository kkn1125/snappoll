import { snapApi } from '@/apis';

export const getPollResponseMe = async () => {
  const { data } = await snapApi.get(`/polls/me/response`);
  return data;
};
