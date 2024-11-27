import { snapApi } from '.';

export async function getPolls() {
  const { data } = await snapApi.get('/polls');
  return data as APIPoll[];
}
