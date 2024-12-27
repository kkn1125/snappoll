import { snapApi } from '@apis/index';

export const writeBoard = async (boardData: Record<string, unknown>) => {
  const { data } = await snapApi.post('/boards', boardData);
  return data;
};
