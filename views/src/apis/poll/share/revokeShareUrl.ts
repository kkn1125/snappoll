import { snapApi } from '@apis/index';

export const revokeShareUrl = async (pollId: string) => {
  const { data } = await snapApi.delete(`/polls/share/${pollId}`);
  return data;
};
