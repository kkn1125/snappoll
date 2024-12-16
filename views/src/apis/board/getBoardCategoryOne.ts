import { snapApi } from '..';

export const getBoardCategoryOne = async (category?: string, id?: string) => {
  if (!category || !id) return {};
  const { data } = await snapApi.get(`/boards/category/${category}/${id}`);
  return data;
};
