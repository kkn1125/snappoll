import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import Logger from '@utils/Logger';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  logger = new Logger(this);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof PrismaClientKnownRequestError) {
      response.status(400).json({
        statusCode: exception.name,
        message: exception.code,
        path: request.url,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const httpException = exception as HttpException;
    this.logger.log(exception);

    const status = httpException.getStatus();
    const cause = (httpException.cause || {}) as {
      codeDomain: string;
      status: number;
      errorStatus: number;
      message: string;
    };
    cause.message = httpException.message;

    response.status(status).json({
      httpCode: status,
      errorCode: cause,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
