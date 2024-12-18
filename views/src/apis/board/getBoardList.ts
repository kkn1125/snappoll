import { snapApi } from '..';

export const getBoardList = async (eachAmount: string = '5') => {
  const { data } = await snapApi.get('/boards/categories', {
    params: { eachAmount },
  });
  return data;
};
