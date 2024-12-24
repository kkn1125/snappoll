import { snapApi } from '@apis/index';

export function addPoll(data: any) {
  snapApi.post('/polls', data, {});
}
