import { snapApi } from '@/apis';

export const getSharePollBy = async (id?: string) => {
  if (!id) return {};
  const { data } = await snapApi.get(`/polls/share/${id}`);
  return data;
};
