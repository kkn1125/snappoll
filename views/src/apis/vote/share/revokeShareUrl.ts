import { snapApi } from '@/apis';

export const revokeShareUrl = async (voteId: string) => {
  const { data } = await snapApi.delete(`/votes/share/${voteId}`);
  return data;
};
