import { snapApi } from '..';

export const deleteBoardForce = async (id: string) => {
  if (!id) return {};
  const { data } = await snapApi.put(`/boards/${id}`);
  return data;
};
