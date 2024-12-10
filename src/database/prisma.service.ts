import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
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
