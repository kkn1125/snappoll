import { Injectable, NestMiddleware } from '@nestjs/common';
import Logger from '@utils/Logger';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  logger: Logger = new Logger(this);

  use(req: Request, res: Response, next: NextFunction) {
    const method = req.method;
    const url = req.originalUrl;
    this.logger.log(`Request ${method} ${url} --->`);
    next();
  }
}
