import { snapApi } from '.';

export async function signup({ checkPassword, ...userData }: SignupUser) {
  const { data } = await snapApi.post('/users', userData);
  return data;
}
