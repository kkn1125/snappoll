import { snapApi } from '..';

export const getBoardCategory = async (page: string, category?: string) => {
  if (!category) return {};
  const { data } = await snapApi.get(`/boards/category/${category}`, {
    params: { page },
  });
  return data;
};
