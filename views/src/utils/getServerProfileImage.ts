import { BASE_URL } from '@common/variables';

export const getServerProfileImage = (path: string) => {
  const pathname = path.replace(/[\\]+/, '/');
  return `${BASE_URL}/${pathname}`;
};
