import { PrismaService } from '@database/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, userPassword: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;
    if (user.deletedAt !== null) {
      throw new BadRequestException('탈퇴된 계정입니다.');
    }

    const encryptedPassword = this.prisma.encryptPassword(userPassword);

    if (user.password !== encryptedPassword) return null;

    const { password, ...result } = user;
    return result;
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

  getMe(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        poll: true,
        userProfile: true,
      },
    });
  }
}
