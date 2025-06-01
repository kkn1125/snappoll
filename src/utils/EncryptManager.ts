import { EXPIRED_TOKEN_TIME } from '@common/variables';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken';
import ms from 'ms';
import SnapLoggerService from '../logger/logger.service';

@Injectable()
export class EncryptManager {
  constructor(
    private readonly logger: SnapLoggerService,
    private readonly configService: ConfigService,
  ) {}

  randomHex() {
    return crypto.randomBytes(10).toString('hex');
  }

  encryptData<T extends string>(data: T) {
    const secretKey = this.configService.get<string>('common.secretKey');
    const hmacKey = CryptoJS.HmacSHA256(data, secretKey);
    return hmacKey.toString(CryptoJS.enc.Hex);
  }

  getRandomHashedPassword() {
    const special = [
      '!',
      '@',
      '#',
      '$',
      '%',
      '^',
      '&',
      '*',
      '.',
      '/',
      '?',
      '\\',
      '-',
      '+',
    ];

    const randomSpecial = special[Math.floor(Math.random() * special.length)];
    const random = Math.floor(Math.random() * (90 - 65 + 1)) + 65;
    const alphabet = String.fromCharCode(random);

    const hex = this.randomHex();

    const hashedPassword = hex.slice(0, 10) + alphabet + randomSpecial;
    return {
      password: hashedPassword,
      hashedPassword: this.encryptData(hashedPassword),
    };
  }

  generateShareUrl(serviceId: string, prefix: string) {
    const now = Date.now();
    const secretKey = this.configService.get<string>('common.secretKey');
    const message = now + '|' + serviceId;
    const hmacKey = CryptoJS.HmacSHA256(message, secretKey);
    const hashedUrl = hmacKey.toString(CryptoJS.enc.Base64url);
    return `${prefix}-${hashedUrl}`;
  }

  getToken(userData: UserTokenData) {
    const secretKey = this.configService.get<string>('common.secretKey');
    const TOKEN_EXPIRED_AT = ms(EXPIRED_TOKEN_TIME);
    const REFRESH_TOKEN_EXPIRED_AT = ms(EXPIRED_TOKEN_TIME * 2);
    this.logger.debug('만료시간 체크:', TOKEN_EXPIRED_AT);
    const token = jwt.sign(userData, secretKey, {
      issuer: 'snapPoll',
      algorithm: 'HS256',
      expiresIn: TOKEN_EXPIRED_AT,
    } as jwt.SignOptions);
    const refreshToken = jwt.sign(
      {
        ...userData,
        loginAt: Date.now(),
      },
      secretKey,
      {
        subject: 'refresh',
        expiresIn: REFRESH_TOKEN_EXPIRED_AT,
        issuer: 'snapPoll',
        algorithm: 'HS256',
      } as jwt.SignOptions,
    );
    return { token, refreshToken };
  }
}
