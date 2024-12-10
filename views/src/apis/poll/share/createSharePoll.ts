import { snapApi } from '../..';

export const createSharePoll = async (pollId: string) => {
  const { data } = await snapApi.post('/polls/share', { pollId });
  return data;
};
