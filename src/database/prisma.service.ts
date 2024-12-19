import { EXPIRED_TOKEN_TIME } from '@common/variables';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import {
  ErrorCode,
  ErrorCodeType,
  ErrorMessage,
  ErrorMessageType,
} from '@utils/codes';
import SnapLogger from '@utils/SnapLogger';
import * as crypto from 'crypto';
import * as CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken';
import ms from 'ms';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  logger = new SnapLogger(this);

  constructor(private readonly configService: ConfigService) {
    super({
      // log: ['query', 'info', 'error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async getErrorCode<
    Domain extends ErrorCodeType[number],
    Name extends Domain[1],
    Message extends ErrorMessageType[Name][number][1],
  >(code: Name, errorCode: Message): Promise<CustomErrorFormat> {
    const [status] = ErrorCode.find((ec) => ec[1] === code);
    const [errorStatus] = ErrorMessage[code].find((em) => em[1] === errorCode);

    const result: CustomErrorFormat = await this.$queryRaw`
      SELECT
        code.status AS status,
        code.domain AS domain,
        error_message.status AS "errorStatus",
        error_message.message AS message
      FROM code
      LEFT JOIN error_message
        ON code.domain = error_message.code_domain
      WHERE code.status = ${status}
        AND error_message.status = ${errorStatus}
    `;
    return result[0];
  }

  randomHex() {
    return crypto.randomBytes(10).toString('hex');
  }

  encryptPassword(originalPassword: string) {
    const secretKey = this.configService.get<string>('common.secretKey');
    const hmacKey = CryptoJS.HmacSHA256(originalPassword, secretKey);
    return hmacKey.toString(CryptoJS.enc.Hex);
  }

  generateShareUrl(pollId: string, prefix: string) {
    const now = Date.now();
    const secretKey = this.configService.get<string>('common.secretKey');
    const message = now + '|' + pollId;
    const hmacKey = CryptoJS.HmacSHA256(message, secretKey);
    const hashedUrl = hmacKey.toString(CryptoJS.enc.Base64url);
    return `${prefix}-${hashedUrl}`;
  }

  getToken(userData: UserTokenData) {
    const secretKey = this.configService.get<string>('common.secretKey');
    const TOKEN_EXPIRED_AT = ms(EXPIRED_TOKEN_TIME);
    const REFRESH_TOKEN_EXPIRED_AT = ms(EXPIRED_TOKEN_TIME * 2);
    this.logger.info('만료시간 체크:', TOKEN_EXPIRED_AT);
    const token = jwt.sign(userData, secretKey, {
      expiresIn: TOKEN_EXPIRED_AT,
      issuer: 'snapPoll',
      algorithm: 'HS256',
    });
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
      },
    );
    return { token, refreshToken };
  }
}
