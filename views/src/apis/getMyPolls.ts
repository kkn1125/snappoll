import { snapApi } from ".";

export async function getMyPolls() {
  const { data } = await snapApi.get('/polls/me');
  return data;
}