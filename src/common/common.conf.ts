import { registerAs } from '@nestjs/config';
import { DATABASE_URL, DIRECT_URL, HOST, MODE, PORT } from './variables';

export default registerAs('common', () => ({
  MODE,
  HOST,
  PORT,
  DATABASE_URL,
  DIRECT_URL,
}));
