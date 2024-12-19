import { Injectable, NestMiddleware } from '@nestjs/common';
import SnapLogger from '@utils/SnapLogger';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class MethodOverrideMiddleware implements NestMiddleware {
  logger = new SnapLogger(this);

  use(req: Request, res: Response, next: NextFunction) {
    // this.override(req, res, next); // `_method` 필드 기반으로 HTTP 메서드 오버라이드
    if ('_method' in req.body) {
      const method = req.body._method.toLowerCase();
      switch (method) {
        case 'patch':
          req.method = method;
          break;
        case 'put':
          req.method = method;
          break;
        case 'delete':
          req.method = method;
          break;
        default:
          break;
      }
    }
    delete req.body._method;
    this.logger.info('메서드 확인:', req.method);
    next();
  }
}
