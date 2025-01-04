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
import { $Enums } from '@prisma/client';

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
    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: { subscription: { include: { plan: true } } },
    });

    /* 유저 존재 검증 */
    if (!dbUser) {
      const errorCode = await this.prisma.getErrorCode('user', 'NotFound');
      throw new BadRequestException(errorCode);
    }
    /* 토큰 구독과 db 유저 구독 일치 검증 */
    const dbSubscription = dbUser.subscription;

    if (subscription.plan.id !== dbSubscription.plan.id) {
      const errorCode = await this.prisma.getErrorCode('plan', 'InvalidPlan');
      throw new BadRequestException(errorCode);
    }

    // const target = validateType.startsWith('poll') ? 'poll' : 'vote';
    // const type = validateType.endsWith('Create') ? 'create' : 'response';
    // this.logger.debug('플랜 검증:', validateType);

    if (
      !subscription ||
      subscription.endDate !== null ||
      subscription.state !== 'Active'
    ) {
      const errorCode = await this.prisma.getErrorCode('plan', 'Forbidden');
      throw new ForbiddenException(errorCode);
    }

    this.logger.info(`${validateType} 작업 진행`);

    const UPPER_CASE =
      subscription.plan.planType.toUpperCase() as keyof typeof LIMIT;

    if (subscription.type in $Enums.SubscribeType) {
      if (validateType === 'pollCreate') {
        const count = await this.prisma.poll.count({
          where: { userId: user.id },
        });
        if (count >= LIMIT[UPPER_CASE].CREATE.POLL) {
          const errorCode = await this.prisma.getErrorCode('poll', 'PollLimit');
          throw new BadRequestException(errorCode);
        }
      } else if (validateType === 'pollResponse') {
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
      } else if (validateType === 'voteCreate') {
        const count = await this.prisma.vote.count({
          where: { userId: user.id },
        });
        if (count >= LIMIT[UPPER_CASE].CREATE.VOTE) {
          const errorCode = await this.prisma.getErrorCode('vote', 'VoteLimit');
          throw new BadRequestException(errorCode);
        }
      } else if (validateType === 'voteResponse') {
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
