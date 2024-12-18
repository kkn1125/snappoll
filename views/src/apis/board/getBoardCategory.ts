import { snapApi } from '..';

export const getBoardCategory = async (category?: string) => {
  if (!category) return {};
  const param = new URLSearchParams(location.search);
  const { data } = await snapApi.get(`/boards/category/${category}`, {
    params: { page: param.get('page') || 1 },
  });
  return data;
};
