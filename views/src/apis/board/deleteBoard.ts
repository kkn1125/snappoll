import { snapApi } from '..';

export const deleteBoard = async ({
  id,
  password,
}: {
  id?: string;
  password: string;
}) => {
  if (!id) return {};
  const { data } = await snapApi.put(`/boards/${id}`, { password });
  return data;
};
