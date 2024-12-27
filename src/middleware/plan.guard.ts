import { PrismaService } from '@database/prisma.service';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import SnapLogger from '@utils/SnapLogger';
import { Request } from 'express';
import { PlanValidate, ValidateType } from './plan-validate.decorator';
import { LIMIT } from '@common/variables';

@Injectable()
export class PlanGuard implements CanActivate {
  logger = new SnapLogger(this);

  constructor(
    private reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const validateType =
      this.reflector.get<ValidateType>(
        PlanValidate,
        context.getHandler(), // 메서드에서 메타데이터를 가져옴
      ) ||
      this.reflector.get<ValidateType>(
        PlanValidate,
        context.getClass(), // 클래스에서 메타데이터를 가져옴
      );

    if (!validateType) return false;

    this.logger.debug('플랜 검증 시작:', validateType);
    const http = context.switchToHttp();
    const req = http.getRequest() as Request;

    const user = req.user;
    const subscription = user.subscription;

    const target = validateType.startsWith('poll') ? 'poll' : 'vote';
    const type = validateType.endsWith('Create') ? 'create' : 'response';
    this.logger.debug('플랜 검증:', target, type);

    if (
      !subscription ||
      subscription.endDate !== null ||
      subscription.state !== 'Active'
    ) {
      const errorCode = await this.prisma.getErrorCode('plan', 'Forbidden');
      throw new ForbiddenException(errorCode);
    }

    this.logger.info(`${target} ${type} 작업 진행`);
    const UPPER_CASE =
      subscription.plan.planType.toUpperCase() as keyof typeof LIMIT;

    this.logger.info('Free plan');
    if (subscription.type === 'Infinite') {
      if (target === 'poll' && type === 'create') {
        const count = await this.prisma.poll.count({
          where: { userId: user.id },
        });
        if (count >= LIMIT[UPPER_CASE].CREATE.POLL) {
          const errorCode = await this.prisma.getErrorCode('poll', 'PollLimit');
          throw new BadRequestException(errorCode);
        }
      } else if (target === 'poll' && type === 'response') {
        if ('pollId' in req.body) {
          const pollId = req.body.pollId;
          const count = await this.prisma.response.count({
            where: { pollId },
          });
          if (count >= LIMIT[UPPER_CASE].RESPONSE.POLL) {
            const errorCode = await this.prisma.getErrorCode(
              'pollResponse',
              'PollResponseLimit',
            );
            throw new BadRequestException(errorCode);
          }
        } else {
          const errorCode = await this.prisma.getErrorCode(
            'pollResponse',
            'BadRequest',
          );
          throw new BadRequestException(errorCode);
        }
      } else if (target === 'vote' && type === 'create') {
        const count = await this.prisma.vote.count({
          where: { userId: user.id },
        });
        if (count >= LIMIT[UPPER_CASE].CREATE.VOTE) {
          const errorCode = await this.prisma.getErrorCode('vote', 'VoteLimit');
          throw new BadRequestException(errorCode);
        }
      } else if (target === 'vote' && type === 'response') {
        if ('voteId' in req.body) {
          const voteId = req.body.voteId;
          const count = await this.prisma.voteResponse.count({
            where: { voteId },
          });
          if (count >= LIMIT[UPPER_CASE].RESPONSE.VOTE) {
            const errorCode = await this.prisma.getErrorCode(
              'voteResponse',
              'VoteResponseLimit',
            );
            throw new BadRequestException(errorCode);
          }
        } else {
          const errorCode = await this.prisma.getErrorCode(
            'voteResponse',
            'BadRequest',
          );
          throw new BadRequestException(errorCode);
        }
      }
    } else {
      const errorCode = await this.prisma.getErrorCode('plan', 'BadRequest');
      throw new BadRequestException(errorCode);
    }

    return true;
  }
}
