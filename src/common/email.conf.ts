import { registerAs } from '@nestjs/config';
import { EMAIL_ADDRESS, EMAIL_PASSWORD } from './variables';

export default registerAs('email', () => ({
  ADDRESS: EMAIL_ADDRESS,
  PASSWORD: EMAIL_PASSWORD,
}));
