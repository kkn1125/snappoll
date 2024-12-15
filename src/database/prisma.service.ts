import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import Logger from '@utils/Logger';
import {
  ErrorCode,
  ErrorCodeType,
  ErrorMessage,
  ErrorMessageType,
} from '@utils/codes';
import * as crypto from 'crypto';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  logger = new Logger(this);

  constructor(private readonly configService: ConfigService) {
    super({
      /* log: ['query', 'info', 'error'] */
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
    const secretKey = this.configService.get<string>('common.SECRET_KEY');
    const hmacKey = CryptoJS.HmacSHA256(originalPassword, secretKey);
    return hmacKey.toString(CryptoJS.enc.Hex);
  }

  generateShareUrl(pollId: string, prefix: string) {
    const now = Date.now();
    const secretKey = this.configService.get<string>('common.SECRET_KEY');
    const message = now + '|' + pollId;
    const hmacKey = CryptoJS.HmacSHA256(message, secretKey);
    const hashedUrl = hmacKey.toString(CryptoJS.enc.Base64url);
    return `${prefix}-${hashedUrl}`;
  }
}
