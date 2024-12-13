import { snapApi } from '.';

export async function login(userData: LoginDto) {
  const { data } = await snapApi.post('/auth/login', userData, {
    withCredentials: true,
  });
  return data;
}
