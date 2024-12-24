import { SnapPoll } from '@models/SnapPoll';
import { snapApi } from '@apis/index';

export const updatePoll = async ({ id, ...poll }: SnapPoll) => {
  const { data } = await snapApi.put(`/polls/${id}`, poll);
  return data;
};
