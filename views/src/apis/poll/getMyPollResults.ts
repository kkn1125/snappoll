import { snapApi } from '..';

export const getMyPollResults = async () => {
  const { data } = await snapApi.get('/polls/results');
  return data;
};
