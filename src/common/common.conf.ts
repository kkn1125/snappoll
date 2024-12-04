import { registerAs } from '@nestjs/config';
import {
  DATABASE_URL,
  DIRECT_URL,
  HOST,
  MODE,
  PORT,
  SECRET_KEY,
  VERSION,
} from './variables';

export default registerAs('common', () => ({
  MODE,
  HOST,
  PORT,
  DATABASE_URL,
  DIRECT_URL,
  SECRET_KEY,
  VERSION,
}));
