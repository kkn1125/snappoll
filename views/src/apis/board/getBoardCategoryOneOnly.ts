import { snapApi } from '@apis/index';

export const getBoardCategoryOneOnly = async (
  category?: string,
  id?: string,
) => {
  if (!category || !id) return {};
  const { data } = await snapApi.get(
    `/boards/category/${category}/${id}?only=true`,
  );
  return data;
};
