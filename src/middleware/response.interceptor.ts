import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { tap, Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const response = context.switchToHttp().getResponse(); // HTTP 응답 객체

    return next.handle().pipe(
      tap(() => {
        console.log(
          `After ... ${Date.now() - now}ms / [${response.statusCode}]`,
        );
      }),
    );
  }
}
