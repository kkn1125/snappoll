import { snapApi } from '@apis/index';

export const getVoteResponse = async (voteId?: string, page: number = 1) => {
  if (!voteId) return {};
  const { data } = await snapApi.get(`/votes/${voteId}/response`, {
    params: { page: '' + page },
  });
  return data;
};
