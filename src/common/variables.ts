import * as dotenv from 'dotenv';
import * as path from 'path';
import * as pkg from '@/../package.json';

export const MODE = process.env.NODE_ENV || 'production';

dotenv.config({
  path: path.join(path.resolve(), '.env'),
});

dotenv.config({
  path: path.join(path.resolve(), `.env.${MODE}`),
});

export const BRAND_NAME = 'SnapPollHelper';

export const HOST = process.env.HOST;
export const PORT = +(process.env.PORT || 8080);
export const DATABASE_URL = process.env.DATABASE_URL;
export const DIRECT_URL = process.env.DIRECT_URL;
export const SECRET_KEY = process.env.SECRET_KEY;
export const VERSION = pkg.version;
export const DOMAIN = 'https://snappoll.kro.kr';
export const CLIENT_DOMAIN =
  MODE === 'development' ? 'http://localhost:5000' : DOMAIN;
export const CURRENT_DOMAIN =
  MODE === 'development' ? 'http://localhost:8080' : DOMAIN;

export const EMAIL_ADDRESS = process.env.EMAIL_ADDRESS as string;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD as string;

export const KAKAO_KEY = process.env.KAKAO_KEY as string;
export const MASTER_PASS = process.env.MASTER_PASS as string;
export const TOSS_SECRET = process.env.TOSS_SECRET as string;

export const EXPIRED_TOKEN_TIME = 30 * 60 * 1000;
export const BUFFER_TIME = 5;

export const LOG_LEVEL = +(process.env?.LOG_LEVEL || 1);

/* plan feature limits */
export const LIMIT = {
  FREE: {
    CREATE: {
      POLL: 3 /* 3 */,
      VOTE: 3 /* 3 */,
    },
    RESPONSE: {
      POLL: 100,
      VOTE: 100,
    },
  },
  BASIC: {
    CREATE: {
      POLL: 7,
      VOTE: 7,
    },
    RESPONSE: {
      POLL: 200,
      VOTE: 200,
    },
  },
  PRO: {
    CREATE: {
      POLL: 12,
      VOTE: 12,
    },
    RESPONSE: {
      POLL: 500,
      VOTE: 500,
    },
  },
  PREMIUM: {
    CREATE: {
      POLL: 30,
      VOTE: 30,
    },
    RESPONSE: {
      POLL: 5000,
      VOTE: 5000,
    },
  },
} as const;
