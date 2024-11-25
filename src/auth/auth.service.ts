import { SECRET_KEY } from '@common/variables';
import { PrismaService } from '@database/prisma.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as CryptoJS from 'crypto-js';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string) {
    const encryptedPassword = this.prisma.encryptPassword(password);
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (user && user.password === encryptedPassword) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  getToken(userData: { id: string; email: string; username: string }) {
    const secretKey = this.configService.get<string>('common.SECRET_KEY');
    return jwt.sign(
      {
        ...userData,
        loginAt: Date.now(),
      },
      secretKey,
      {
        expiresIn: '1h',
        issuer: 'snapPoll',
        algorithm: 'HS256',
      },
    );
  }
}
