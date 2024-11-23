import { snapApi } from '.';

export async function getPoll(id: string) {
  const { data } = await snapApi.get(`/polls/${id}`);
  return data;
}
