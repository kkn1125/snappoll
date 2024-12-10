import { snapApi } from '@/apis';

export const revokeShareUrl = async (pollId: string) => {
  const { data } = await snapApi.delete(`/polls/share/${pollId}`);
  return data;
};
