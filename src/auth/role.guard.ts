import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AuthService } from './auth.service';
import { Roles } from './roles.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ) /* : boolean | Promise<boolean> | Observable<boolean> */ {
    const roles = this.reflector.get(Roles, context.getHandler());
    // if (!roles) {
    //   return true;
    // }

    const http = context.switchToHttp();
    const req = http.getRequest() as Request;
    const secretKey = this.configService.get('common.SECRET_KEY');
    try {
      const result = jwt.verify(req.cookies.token, secretKey, {
        algorithms: ['HS256'],
      }) as JwtPayload;

      const user = await this.authService.getMe(result.email);
      if (result) {
        req.verify = result;
        req.token = req.cookies.token;
      }
      if (user) {
        const { password, ...users } = user;
        req.user = users;
      }

      return !!result;
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('토큰이 만료되었습니다.');
      } else {
        throw new BadRequestException('잘못된 접근입니다.');
      }
    }
  }
}
