import { snapApi } from '..';

export const getTerms = async () => {
  const { data } = await snapApi.get('/terms');
  return data;
};
