import { snapApi } from '../..';

export const getShareVote = async (url?: string) => {
  if (!url) return {};
  const { data } = await snapApi.get(`/votes/share/url/${url}`);
  return data;
};
