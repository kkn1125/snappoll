import { snapApi } from '..';

export const getMyVoteResults = async () => {
  const { data } = await snapApi.get('/votes/results');
  return data;
};
