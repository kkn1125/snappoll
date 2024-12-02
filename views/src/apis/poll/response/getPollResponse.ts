import { snapApi } from '@/apis';

export const getPollResponse = async (pollId?: string) => {
  if (!pollId) return {};
  const { data } = await snapApi.get(`/polls/${pollId}/response`);
  return data;
};
