import { snapApi } from '..';

export const createPoll = async (createData: Record<string, any>) => {
  const { data } = await snapApi.post('/polls', createData);
  return data;
};
