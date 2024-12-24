import { snapApi } from '@apis/index';

export const removeVoteResponse = async (responseId: string) => {
  const { data } = await snapApi.delete(`/votes/response/${responseId}`);
  return data;
};
