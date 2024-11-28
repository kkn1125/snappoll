import { snapApi } from '.';

export async function removeVote(voteId: string) {
  const { data } = await snapApi.delete(`/votes/${voteId}`);
  return data;
}
