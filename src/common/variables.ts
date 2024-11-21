import * as dotenv from 'dotenv';
import * as path from 'path';

export const MODE = process.env.NODE_ENV;

dotenv.config({
  path: path.join(path.resolve(), '.env'),
});

dotenv.config({
  path: path.join(path.resolve(), `.env.${MODE}`),
});

export const HOST = process.env.HOST;
export const PORT = +(process.env.PORT || 8080);
export const DATABASE_URL = process.env.DATABASE_URL;
export const DIRECT_URL = process.env.DIRECT_URL;
