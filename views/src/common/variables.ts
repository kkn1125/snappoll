export const logoImage = import.meta.resolve('/logo/SnapPoll_small.webp');
export const guestMainImage = import.meta.resolve('/images/main.webp');
export const defaultProfile = import.meta.resolve(
  '/images/default_profile.webp',
);
export const illu01 = import.meta.resolve('/images/illu-01.webp');
export const illu02 = import.meta.resolve('/images/illu-02.webp');
export const BRAND_NAME = 'SnapPoll';

export const MODE = process.env.MODE;
export const HOST = process.env.HOST;
export const PORT = process.env.PORT;
export const PROJECT_BASEPATH = process.env.PROJECT_BASEPATH;
export const USER_NAME = process.env.USER_NAME as string;
export const USER_BLOG = process.env.USER_BLOG as string;
export const USER_PROFILE = process.env.USER_PROFILE as string;
export const VERSION = process.env.VERSION as string;

export const DATE_FORMAT = 'YYYY. MM. DD. HH:mm';

export { default as Illu01 } from '@assets/illustrations/illu-01.svg?react';
export { default as Illu02 } from '@assets/illustrations/illu-02.svg?react';
export { default as DefaultProfile } from '@assets/illustrations/default_profile.svg?react';

/* disallow */
export const guestDisallowPaths =
  /\/user\/profile|\/(votes|polls|notice|graph)\/?(.*)/;
export const userDisallowPaths = /\/user\/(login|signup)\/?(.*)/;
