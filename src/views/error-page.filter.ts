import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import SnapLogger from '@utils/SnapLogger';
import { Request, Response } from 'express';

@Catch()
export class ErrorPageFilter implements ExceptionFilter {
  logger = new SnapLogger(this);

  constructor() {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const timestamp = new Date().toISOString();
    const requestUrl = request.url;

    this.logger.error('에러 확인 필요', exception);

    // if (exception instanceof PrismaClientKnownRequestError) {
    //   response.status(400).json({
    //     statusCode: exception.name,
    //     message: exception.code,
    //     path: requestUrl,
    //     timestamp,
    //   });
    //   return;
    // }

    const httpException = exception as HttpException;
    // const status = httpException.getStatus();
    // const exceptionResponse = httpException.getResponse();

    // response.status(status).json({
    //   httpCode: status,
    //   errorCode: exceptionResponse,
    //   path: requestUrl,
    //   timestamp,
    // });
    response.render('notfound');
  }
}
