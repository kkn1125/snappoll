import { snapApi } from '@apis/index';

export const writeBoard = async (boardData: Record<string, string>) => {
  const { data } = await snapApi.post('/boards', boardData);
  return data;
};
