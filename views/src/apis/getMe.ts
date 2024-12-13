import { snapApi } from '.';

export async function getMe<T>() {
  const { data } = await snapApi.get('/users/me');
  return data as SnapResponseType<T>;
}
