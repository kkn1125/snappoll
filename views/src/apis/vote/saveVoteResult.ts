import { SnapVoteResponse } from '@models/SnapVoteResponse';
import { snapApi } from '@apis/index';

export async function saveVoteResult(saveData: SnapVoteResponse) {
  const { data } = await snapApi.post(`/votes/response`, saveData);
  return data;
}
