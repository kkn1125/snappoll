export const logoImage = import.meta.resolve('/logo/SnapPoll_small.webp');
export const guestMainImage = import.meta.resolve('/images/main.webp');
export const defaultProfile = import.meta.resolve(
  '/images/default_profile.webp',
);
export const illu01 = import.meta.resolve('/images/illu-01.webp');
export const illu02 = import.meta.resolve('/images/illu-02.webp');
export const surveyImage = import.meta.resolve('/images/survey.webp');
export const voteImage = import.meta.resolve('/images/vote.webp');
export const BRAND_NAME = 'SnapPoll';

export const MODE = process.env.MODE;
export const BASE_CLIENT_URL =
  MODE === 'development' ? `http://${location.hostname}:5000` : location.origin;
export const BASE_SERVER_URL =
  MODE === 'development' ? `http://${location.hostname}:8080` : location.origin;
export const BASE_URL = BASE_SERVER_URL + '/api';
export const HOST = process.env.HOST;
export const PORT = process.env.PORT;
export const PROJECT_BASEPATH = process.env.PROJECT_BASEPATH;
export const USER_NAME = process.env.USER_NAME as string;
export const USER_EMAIL = process.env.USER_EMAIL as string;
export const USER_BLOG = process.env.USER_BLOG as string;
export const USER_PROFILE = process.env.USER_PROFILE as string;
export const VERSION = process.env.VERSION as string;
export const DESCRIPTION = process.env.DESCRIPTION as string;
export const CLIENT_KEY = process.env.CLIENT_KEY as string;
export const TOSS_SECRET = process.env.TOSS_SECRET as string;

export const DATE_FORMAT = 'YYYY. MM. DD. HH:mm';

export { default as Kakao } from '@assets/icon/kakao.svg?react';
export { default as Illu01 } from '@assets/illustrations/illu-01.svg?react';
export { default as Illu02 } from '@assets/illustrations/illu-02.svg?react';
export { default as DefaultProfile } from '@assets/illustrations/default_profile.svg?react';

/* disallow */
export const guestDisallowPaths = /\/(user|service|notice|panel|graph|price\/change)\/?(.*)/;
export const guestAllowPaths = /^\/service\/(poll|vote)\/share(.*)$/g;
export const userDisallowPaths = /\/(auth)\/?(.*)/;

export const scrollSize = 5;

export const UnknownName = '익명';

export const HEADER_CHANGE_POINT = 50;
export const SIDEBAR_WIDTH = {
  MIN: 56,
  MAX: 250,
};

export const GRAPH = {
  MAX_HEIGHT: '50vmin' /* '70vh' */,
};

export const CHART_COLORS = [
  '#ff9800',
  '#ff69b4',
  '#4caf50',
  '#2196f3',
  '#9c27b0',
  '#e91e63',
  '#009688',
  '#673ab7',
  '#3f51b5',
  '#ffc107',
  '#8bc34a',
  '#9e9e9e',
  '#795548',
  '#03a9f4',
  '#00bcd4',
];
