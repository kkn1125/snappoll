import { snapApi } from '.';

export async function getPoll(id?: string) {
  if (!id) return {};
  const { data } = await snapApi.get(`/polls/${id}`);
  return data;
}
