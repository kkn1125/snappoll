import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '@database/prisma.service';
import Logger from '@utils/Logger';
import { isNil } from '@utils/isNil';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  logger = new Logger(this);

  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    if (!email || !password) {
      const errorCode = this.prisma.getErrorCode('auth', 'BadRequest');
      throw new UnauthorizedException(errorCode);
    }

    const user = await this.authService.validateUser(email, password);

    if (isNil(user)) {
      const errorCode = await this.prisma.getErrorCode('auth', 'CheckUserData');
      this.logger.debug('errorCode:', errorCode);
      throw new UnauthorizedException(errorCode);
    }
    return user;
  }
}
