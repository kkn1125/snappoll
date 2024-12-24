import { SnapResponse } from '@models/SnapResponse';
import { snapApi } from '@apis/index';

export async function savePollResult(saveData: SnapResponse) {
  const { data } = await snapApi.post(`/polls/response`, saveData);
  return data;
}
