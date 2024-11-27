import { snapApi } from '.';

export async function getMe() {
  const { data } = await snapApi.get('/users/me');
  return data as {
    ok: boolean;
    user: User;
    token: string;
  };
}
