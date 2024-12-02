import { snapApi } from '..';

export async function getVotes() {
  const param = new URLSearchParams(location.search);
  const { data } = await snapApi.get('/votes', {
    params: { page: param.get('page') || 1 },
  });
  return data;
}
