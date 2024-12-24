import { snapApi } from '@apis/index';

export const getBoardList = async (eachAmount: string = '5') => {
  const { data } = await snapApi.get('/boards/categories', {
    params: { eachAmount },
  });
  return data;
};
