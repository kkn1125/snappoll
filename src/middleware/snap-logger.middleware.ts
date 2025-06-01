import SnapLoggerService from '@logger/logger.service';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class SnapLoggerMiddleware implements NestMiddleware {
  logger: SnapLoggerService = new SnapLoggerService('Middleware');

  use(req: Request, res: Response, next: NextFunction) {
    const method = req.method;
    const url = req.originalUrl;
    const queryUrl = req.url;
    const queryStartIndex = queryUrl.indexOf('?');
    const queries =
      queryStartIndex === -1 ? '' : new URLSearchParams(queryUrl.slice(1));
    const body = req.body;
    // const header = req.headers;
    this.logger.debug(`Request ${method} ${url} --->`);
    // this.logger.log(`Request Header:`, header);
    this.logger.debug(
      `Request Query: ${decodeURIComponent(queries.toString())}`,
    );
    this.logger.debug(`Request Body:`, body);
    next();
  }
}
