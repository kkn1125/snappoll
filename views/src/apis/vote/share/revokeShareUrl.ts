import { snapApi } from '@apis/index';

export const revokeShareUrl = async (voteId: string) => {
  const { data } = await snapApi.delete(`/votes/share/${voteId}`);
  return data;
};
