import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { tap, Observable, map } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const response = context.switchToHttp().getResponse() as Response; // HTTP 응답 객체

    return next.handle().pipe(
      tap(() => {
        console.log(
          `After ... ${Date.now() - now}ms / [${response.statusCode}]`,
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
