import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Reflector } from '@nestjs/core';
import Logger from '@utils/Logger';

@Injectable()
export class CookieGuard implements CanActivate {
  logger = new Logger(this);

  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    if (isPublic) {
      return true;
    }

    const http = context.switchToHttp();
    const req = http.getRequest() as Request;
    const res = http.getResponse() as Response;
    const secretKey = this.configService.get('common.SECRET_KEY');

    if (!req.cookies.token) {
      this.logger.debug('쿠키 토큰 없음');
      throw new UnauthorizedException('잘못된 요청입니다.');
    }

    let decodedToken: JwtPayload;

    try {
      decodedToken = jwt.decode(req.cookies.token) as JwtPayload;
      this.logger.debug('쿠키 토큰 디코딩 됨', decodedToken);
    } catch (error) {
      const { message, ...status } = await this.authService.prisma.getErrorCode(
        'auth',
        'BadRequest',
      );
      throw new BadRequestException(message, { cause: status });
    }

    try {
      const isSocial = decodedToken.iss === 'https://kauth.kakao.com';
      this.logger.debug('소셜계정 여부:', isSocial);

      if (isSocial) {
        req.verify = decodedToken;
        req.token = req.cookies.token;
        const customData = {
          id: decodedToken.aud[0],
          // createdAt: Date,
          email: decodedToken.email,
          username: decodedToken.nickname,
          userProfile: {
            image: decodedToken.picture,
          },
        };
        req.user = customData as any;
        return !!decodedToken;
      }

      const result = jwt.verify(req.cookies.token, secretKey, {
        algorithms: ['HS256'],
      }) as JwtPayload;

      const user = await this.authService.getMe(result.email);
      if (result) {
        req.verify = result;
      }
      if (user) {
        const { localUser, socialUser, ...users } = user;
        req.user = users;
      }
      // return !!result;
    } catch (error: any) {
      console.log(error);
      if (error.name === 'JsonWebTokenError') {
        if (error.message === 'jwt must be provided') {
          throw new UnauthorizedException('잘못된 요청입니다.');
        }
      } else if (error.name === 'TokenExpiredError') {
        // console.log(error.message);
        try {
          /* refresh check */
          const result = jwt.verify(req.cookies.refresh, secretKey, {
            algorithms: ['HS256'],
          }) as JwtPayload;
          if (result) {
            console.log('토큰 재발급 완료');
          }
          const user = jwt.decode(req.cookies.token, {
            json: true,
          }) as JwtPayload;
          const { token, refreshToken } = this.authService.getToken({
            id: user.id,
            email: user.email,
            username: user.username,
          });
          req.verify = user;
          res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            path: '/',
          });
          res.cookie('refresh', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            path: '/',
          });
        } catch (error: any) {
          console.log(error.name, error.message);
          console.log('invalid refresh token!');
          //
          res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            path: '/',
          });
          res.clearCookie('refresh', {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            path: '/',
          });
        }
      } else {
        //
        res.clearCookie('token', {
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
          path: '/',
        });
        res.clearCookie('refresh', {
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
          path: '/',
        });
      }
    }
    return true;
  }
}
