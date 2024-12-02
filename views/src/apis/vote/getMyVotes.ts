import { snapApi } from '..';

export async function getMyVotes() {
  const param = new URLSearchParams(location.search);
  const { data } = await snapApi.get('/votes/me', {
    params: { page: param.get('page') || 1 },
  });
  console.log(data);
  return data;
}
