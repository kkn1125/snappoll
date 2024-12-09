import { snapApi } from '.';

export const checkEmail = async (email: string) => {
  const { data } = await snapApi.get(`/auth/check/email/${email}`, {
    timeout: 1 * 60 * 1000,
  });
  return data;
};
