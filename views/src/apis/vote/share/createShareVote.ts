import { snapApi } from '../..';

export const createShareVote = async (voteId: string) => {
  const { data } = await snapApi.post('/votes/share', { voteId });
  return data;
};
