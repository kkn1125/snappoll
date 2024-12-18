import { BASE_URL } from '@common/variables';

export const getServerProfileImage = (path: string) => {
  const now = Date.now();
  const pathname = path.replace(/[\\]+/, '/');
  return `${BASE_URL}/users/profile/${pathname}?v=${now}`;
};
