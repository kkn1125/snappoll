import { snapApi } from '@apis/index';

export const resumeShareUrl = async (pollId: string) => {
  const { data } = await snapApi.put(`/polls/share/${pollId}`);
  return data;
};
