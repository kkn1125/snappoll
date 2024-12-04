import { snapApi } from '@/apis';

export const removeVoteResponse = async (responseId: string) => {
  const { data } = await snapApi.delete(`/votes/response/${responseId}`);
  return data;
};
