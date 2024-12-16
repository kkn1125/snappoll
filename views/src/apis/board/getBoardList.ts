import { snapApi } from '..';

export const getBoardList = async () => {
  const { data } = await snapApi.get('/boards');
  return data;
};
