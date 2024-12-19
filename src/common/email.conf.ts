import { registerAs } from '@nestjs/config';
import {
  BRAND_NAME,
  EMAIL_ADDRESS,
  EMAIL_PASSWORD,
  MASTER_PASS,
} from './variables';

export default registerAs('email', () => ({
  address: EMAIL_ADDRESS,
  password: EMAIL_PASSWORD,
  defaultName: BRAND_NAME,
  defaultEmail: EMAIL_ADDRESS,
  masterPass: MASTER_PASS,
}));
