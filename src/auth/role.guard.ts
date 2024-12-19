import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import SnapLogger from '@utils/SnapLogger';
import { Request } from 'express';
import { Roles } from './roles.decorator';
import { $Enums } from '@prisma/client';

@Injectable()
export class RoleGuard implements CanActivate {
  logger = new SnapLogger(this);

  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    this.logger.debug('역할 검증 시작');
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      this.logger.debug('정의된 역할 없음');
      return true;
    }

    const http = context.switchToHttp();
    const req = http.getRequest() as Request;
    const role = req.user?.role as $Enums.Role;
    this.logger.debug('역할:', role);
    this.logger.debug('역할 검증 끝');
    return roles.includes(role);
  }
}
