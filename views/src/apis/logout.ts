import { snapApi } from '.';

export async function logout() {
  const { data } = await snapApi.post('/auth/logout');
  return data;
}
