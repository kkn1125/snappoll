import { snapApi } from '.';

export async function savePollResult(
  pollId: string,
  userId: string,
  data: string,
) {
  await snapApi.post(`/polls/results`, {
    pollId,
    userId,
    answer: data,
  });
}
