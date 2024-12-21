import { snapApi } from '..';

export const sendConfirmMail = async () => {
  const { data } = await snapApi.post(
    '/mailer/confirm',
    {},
    { timeout: Infinity },
  );
  return data;
};
