import { SnapVote } from '@models/SnapVote';
import { snapApi } from '@apis/index';

export const createVote = async (voteData: SnapVote) => {
  const { data } = await snapApi.post('/votes', voteData);
  return data;
};
