import { snapApi } from '.';

export async function verifyLogin() {
  const { data } = await snapApi.post('/auth/verify');
  return data;
}
