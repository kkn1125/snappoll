import { snapApi } from '.';

export async function getVotes() {
  const { data } = await snapApi.get('/votes');
  return data;
}
