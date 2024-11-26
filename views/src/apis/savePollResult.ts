import { snapApi } from '.';

export async function savePollResult(
  pollId: string,
  data: string,
  isCrew: boolean,
) {
  await snapApi.post(`/polls/results`, {
    pollId,
    answer: data,
    isCrew,
  });
}
