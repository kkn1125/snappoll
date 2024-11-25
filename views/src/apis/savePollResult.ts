import { snapApi } from '.';

export async function savePollResult(pollId: string, data: string) {
  await snapApi.post(`/polls/results`, {
    pollId,
    answer: data,
  });
}
