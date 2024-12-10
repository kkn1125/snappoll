import { snapApi } from '../..';

export const getSharePoll = async (url?: string) => {
  if (!url) return {};
  const { data } = await snapApi.get(`/polls/share/url/${url}`);
  return data;
};
