import { snapApi } from '@/apis';

export const resumeShareUrl = async (pollId: string) => {
  const { data } = await snapApi.put(`/polls/share/${pollId}`);
  return data;
};
