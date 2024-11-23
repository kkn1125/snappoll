import { snapApi } from '.';

export function addPoll(data: any) {
  snapApi.post('/polls', data, {});
}
