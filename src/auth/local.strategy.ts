import { PrismaService } from '@database/prisma.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import SnapLoggerService from '@logger/logger.service';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    private readonly logger: SnapLoggerService,
  ) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    this.logger.debug('payload 확인:', email, password);
    if (!email || !password) {
      const errorCode = this.prisma.getErrorCode('auth', 'BadRequest');
      throw new UnauthorizedException(errorCode);
    }

    return this.authService.validateUser(email, password);
  }
}
