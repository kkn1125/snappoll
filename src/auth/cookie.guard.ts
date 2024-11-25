import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CookieGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const http = context.switchToHttp();
    const req = http.getRequest() as Request;
    const secretKey = this.configService.get('common.SECRET_KEY');
    try {
      const result = jwt.verify(req.cookies.token, secretKey, {
        algorithms: ['HS256'],
      });
      return !!result;
    } catch (error) {
      return false;
    }
  }
}
