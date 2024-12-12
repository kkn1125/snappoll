import { snapApi } from '.';

export const initPass = async (info: { email: string }) => {
  const { data } = await snapApi.post('/auth/init', info, {
    timeout: Infinity,
  });
  return data;
};
