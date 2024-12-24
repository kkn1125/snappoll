import { snapApi } from '@apis/index';

export const validateBoardPassword = async ({
  id,
  password,
}: {
  id?: string;
  password: string;
}) => {
  if (!id) return {};
  const { data } = await snapApi.post(`/boards/${id}/validate`, { password });
  return data;
};
