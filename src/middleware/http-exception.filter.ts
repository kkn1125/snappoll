import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import SnapLogger from '@utils/SnapLogger';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  logger = new SnapLogger(this);

  constructor() {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const timestamp = new Date().toISOString();
    const requestUrl = request.url;

    this.logger.error('에러 확인 필요', exception);

    if (exception instanceof PrismaClientKnownRequestError) {
      response.status(400).json({
        statusCode: exception.name,
        message: exception.code,
        path: requestUrl,
        timestamp,
      });
      return;
    }

    const httpException = exception as HttpException;

    const status = httpException?.getStatus?.() || 500;
    const exceptionResponse = httpException?.getResponse?.();

    if (httpException instanceof ThrottlerException) {
      response.status(status).json({
        httpCode: status,
        errorCode: { message: exceptionResponse },
        path: requestUrl,
        timestamp,
      });
      return;
    }

    const isValidationException =
      typeof exceptionResponse === 'object' &&
      'message' in exceptionResponse &&
      Array.isArray(exceptionResponse.message);

    if (isValidationException) {
      this.logger.error('ValidationError', exceptionResponse.message);
      response.status(status).json({
        httpCode: status,
        errorCode: {
          status: 400,
          domain: 'user',
          errorStatus: -999,
          message: '잘못된 요청입니다.',
        },
        path: requestUrl,
        timestamp,
      });
    } else {
      response.status(status).json({
        httpCode: status,
        errorCode: exceptionResponse ?? -999,
        path: requestUrl,
        timestamp,
      });
    }
  }
}
