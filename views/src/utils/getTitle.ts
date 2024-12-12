import { BRAND_NAME } from '@common/variables';

const pathToTitle:Record<string,string> = {
  '/': '',
};

export const getTitle = () => {
  return BRAND_NAME + pathToTitle[location.pathname];
};
