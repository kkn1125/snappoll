import { snapApi } from '@apis/index';

export const resumeShareUrl = async (voteId: string) => {
  const { data } = await snapApi.put(`/votes/share/${voteId}`);
  return data;
};
