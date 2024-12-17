import { registerAs } from '@nestjs/config';
import {
  CURRENT_DOMAIN,
  DATABASE_URL,
  DIRECT_URL,
  HOST,
  KAKAO_KEY,
  MODE,
  PORT,
  SECRET_KEY,
  VERSION,
} from './variables';

export default registerAs('common', () => ({
  mode: MODE,
  host: HOST,
  port: PORT,
  databaseUrl: DATABASE_URL,
  directUrl: DIRECT_URL,
  secretKey: SECRET_KEY,
  version: VERSION,
  kakaoKey: KAKAO_KEY,
  currentDomain: CURRENT_DOMAIN,
}));
