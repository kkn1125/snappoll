import { snapApi } from '..';

interface ViewCountProps {
  category?: string;
  id?: string;
}
export const viewCount = async ({ category, id }: ViewCountProps) => {
  if (!category || !id) return {};
  const { data } = await snapApi.put(`/boards/category/${category}/${id}/view`);
  return data;
};
