import { snapApi } from '@apis/index';

export const sendConfirmMail = async () => {
  const { data } = await snapApi.post(
    '/mailer/confirm',
    {},
    { timeout: Infinity },
  );
  return data;
};
