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
}
