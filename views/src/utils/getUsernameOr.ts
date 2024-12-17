import { UnknownName } from '@common/variables';

export const getUsernameOr = (username?: string) => {
  return username || UnknownName;
};
