import { snapApi } from '@apis/index';

export async function getMyVotes() {
  const param = new URLSearchParams(location.search);
  const { data } = await snapApi.get('/votes/me', {
    params: { page: param.get('page') || 1 },
  });
  return data;
}
