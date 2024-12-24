import { snapApi } from '@apis/index';

export const updateUser = async ({ id, data }: { id: string; data: any }) => {
  const { data: res } = await snapApi.put(`/users/${id}`, data);
  return res;
};
