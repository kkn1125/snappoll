import { SnapResponse } from '@models/SnapResponse';
import { snapApi } from '.';

export async function savePollResult(saveData: SnapResponse) {
  const { data } = await snapApi.post(`/polls/response`, saveData);
  return data;
}
