import { snapApi } from '@apis/index';

export const getResponse = async (responseId?: string) => {
  if (!responseId) return {};
  const { data } = await snapApi.get(`/polls/response/${responseId}`);
  return data;
};
