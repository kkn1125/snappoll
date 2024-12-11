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
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    if (isPublic) {
      return true;
    }

    const roles = this.reflector.get(Roles, context.getHandler());
    // if (!roles) {
    //   return true;
    // }

    const http = context.switchToHttp();
    const req = http.getRequest() as Request;
    const secretKey = this.configService.get('common.SECRET_KEY');
    try {
      const isSocial = jwt.decode(req.cookies.token) as JwtPayload;
      console.log('isSocial:', isSocial);
      if (isSocial.iss === 'https://kauth.kakao.com') {
        req.verify = isSocial;
        req.token = req.cookies.token;
        const customData = {
          id: isSocial.aud[0],
          // createdAt: Date,
          email: isSocial.email,
          username: isSocial.nickname,
          userProfile: {
            image: isSocial.picture,
          },
        };
        req.user = customData as any;
        return !!isSocial;
      }

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
