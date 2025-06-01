import SnapLoggerService from '@logger/logger.service';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { $Enums } from '@prisma/client';
import { Request } from 'express';
import { Roles } from './roles.decorator';

/* UseGuards(RoleGuard)로 사용해야 함. */
@Injectable()
export class RoleGuard implements CanActivate {
  logger = new SnapLoggerService(this);

  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    this.logger.debug('역할 검증 시작');
    const roles =
      this.reflector.get(Roles, context.getHandler()) ||
      this.reflector.get(Roles, context.getClass());
    if (!roles) {
      this.logger.debug('정의된 역할 없음');
      return true;
    }

    const http = context.switchToHttp();
    const req = http.getRequest() as Request;
    const role = req.user?.role as $Enums.Role;
    this.logger.debug('역할:', role);
    this.logger.debug('역할 검증 끝');
    if (roles.includes($Enums.Role.Admin) && role !== $Enums.Role.Admin) {
      throw new ForbiddenException({
        message: '권한이 없습니다.',
      });
    }
    return roles.includes(role);
  }
}
