import { snapApi } from '@/apis';

export const getVoteResponse = async (voteId?: string) => {
  if (!voteId) return {};
  const { data } = await snapApi.get(`/votes/${voteId}/response`);
  return data;
};
