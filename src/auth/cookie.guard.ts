import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class CookieGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ) /* : boolean | Promise<boolean> | Observable<boolean> */ {
    const http = context.switchToHttp();
    const req = http.getRequest() as Request;
    const res = http.getResponse() as Response;
    const secretKey = this.configService.get('common.SECRET_KEY');
    try {
      const result = jwt.verify(req.cookies.token, secretKey, {
        algorithms: ['HS256'],
      }) as JwtPayload;
      // console.log('result:', result);
      const user = await this.authService.getMe(result.email);
      if (result) {
        req.verify = result;
      }
      if (user) {
        const { password, ...users } = user;
        req.user = users;
      }
      // return !!result;
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
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
