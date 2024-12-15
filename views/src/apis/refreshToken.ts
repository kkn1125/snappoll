import { snapApi } from '.';

export const refreshToken = async () => {
  const { data } = await snapApi.post('/auth/refresh');
  return data;
};
