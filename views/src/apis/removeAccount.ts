import { snapApi } from '.';

export async function removeAccount(id: string) {
  const { data } = await snapApi.delete(`/users/${id}`);
  return data;
}
