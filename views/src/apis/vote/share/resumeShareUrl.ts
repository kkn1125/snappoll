import { snapApi } from '@/apis';

export const resumeShareUrl = async (voteId: string) => {
  const { data } = await snapApi.put(`/votes/share/${voteId}`);
  return data;
};
