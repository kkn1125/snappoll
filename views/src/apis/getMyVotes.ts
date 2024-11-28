import { snapApi } from '.';

export async function getMyVotes() {
  const { data } = await snapApi.get('/votes/me');
  return data;
}
