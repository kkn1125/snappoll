import { SnapVote } from '@models/SnapVote';
import { snapApi } from '@apis/index';

export const updateVote = async ({ id, ...vote }: SnapVote) => {
  const { data } = await snapApi.put(`/votes/${id}`, vote);
  return data;
};
