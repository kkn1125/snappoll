import { snapApi } from '.';

export async function removePoll(pollId: string) {
  const { data } = await snapApi.delete(`/polls/${pollId}`);
  return data;
}
