import { snapApi } from '..';

export const getGraphPollData = async (id?: string) => {
  if (!id) return {};
  const response = await snapApi.get(`/polls/graph/${id}`);
  return response.data;
};
