import { snapApi } from '@apis/index';

export const getPollResponse = async (pollId?: string, page: number = 1) => {
  if (!pollId) return {};
  const { data } = await snapApi.get(`/polls/${pollId}/response`, {
    params: { page: '' + page },
  });
  return data;
};
