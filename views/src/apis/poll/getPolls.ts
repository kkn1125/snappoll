import { snapApi } from '..';

export async function getPolls() {
  const param = new URLSearchParams(location.search);
  const { data } = await snapApi.get('/polls', {
    params: { page: param.get('page') || 1 },
  });
  return data;
}
