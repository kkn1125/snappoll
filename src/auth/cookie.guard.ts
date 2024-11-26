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
      const user = await this.authService.getMe(result.email);
      if (result) {
        req.verify = result;
      }
      if (user) {
        const { password, ...users } = user;
        req.user = users;
      }
      // return !!result;
    } catch (error) {
      //
      res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
      });
    }
    return true;
  }
}
