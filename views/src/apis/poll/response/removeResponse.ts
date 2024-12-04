import { snapApi } from '@/apis';

export const removeResponse = async (responseId: string) => {
  const { data } = await snapApi.delete(`/polls/response/${responseId}`);
  return data;
};
