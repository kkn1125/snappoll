import { snapApi } from '..';

export async function getMyPolls() {
  const param = new URLSearchParams(location.search);
  const { data } = await snapApi.get('/polls/me', {
    params: { page: param.get('page') || 1 },
  });
  return data;
}
