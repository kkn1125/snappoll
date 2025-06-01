import SnapLoggerService from '@logger/logger.service';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

/* 모든 예외 처리 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: SnapLoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const timestamp = new Date().toISOString();
    const requestUrl = request.url;
    const method = request.method;
    const httpCode =
      exception instanceof HttpException ? exception.getStatus() : 500;

    this.logger.error('에러 확인 필요', exception);

    let data: CustomErrorResponse;

    /* NestJS 예외 처리리 */
    if (exception instanceof HttpException) {
      const { status, domain, errorStatus, message } =
        exception.getResponse() as CustomErrorFormat;
      data = {
        httpCode: httpCode,
        errorCode: {
          domainStatus: status,
          errorStatus,
          domain,
          message,
        },
        method,
        path: requestUrl,
        timestamp,
      };
    } else {
      /* 불특정 예외 처리 */
      const error = exception as any;
      data = {
        httpCode: 500,
        errorCode: {
          domainStatus: 500,
          errorStatus: -999,
          domain: 'server',
          message: error.message || 'Internal Server Error',
        },
        method,
        path: requestUrl,
        timestamp,
      };
    }
    response.status(data.httpCode).json(data);
  }
}
