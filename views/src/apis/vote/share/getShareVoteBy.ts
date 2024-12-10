import { snapApi } from '@/apis';

export const getShareVoteBy = async (id?: string) => {
  if (!id) return {};
  const { data } = await snapApi.get(`/votes/share/${id}`);
  return data;
};
