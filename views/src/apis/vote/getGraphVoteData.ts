import { snapApi } from '..';

export const getGraphVoteData = async (id?: string) => {
  if (!id) return {};
  const response = await snapApi.get(`/votes/graph/${id}`);
  return response.data;
};
