import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { tap, Observable, map } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest() as Request; // HTTP 요청 객체
    const response = context.switchToHttp().getResponse() as Response; // HTTP 응답 객체
    const method = request.method;
    const url = request.originalUrl;

    return next.handle().pipe(
      tap(() => {
        console.log(
          `After ... ${Date.now() - now}ms / [${response.statusCode}] <-- Request ${method} ${url}`,
        );
      }),
      map((data) => {
        return {
          ok: [200, 201].includes(response.statusCode),
          data,
        };
      }),
    );
  }
}
