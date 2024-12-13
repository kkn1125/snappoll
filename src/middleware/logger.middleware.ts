import { Injectable, NestMiddleware } from '@nestjs/common';
import Logger from '@utils/Logger';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  logger: Logger = new Logger('Middleware');

  use(req: Request, res: Response, next: NextFunction) {
    const method = req.method;
    const url = req.originalUrl;
    const queryUrl = req.url;
    const queryStartIndex = queryUrl.indexOf('?');
    const queries =
      queryStartIndex === -1 ? '' : new URLSearchParams(queryUrl.slice(1));
    const body = req.body;
    // const header = req.headers;
    this.logger.log(`Request ${method} ${url} --->`);
    // this.logger.log(`Request Header:`, header);
    this.logger.log(`Request Query: ${decodeURIComponent(queries.toString())}`);
    this.logger.log(`Request Body:`, body);
    next();
  }
}
