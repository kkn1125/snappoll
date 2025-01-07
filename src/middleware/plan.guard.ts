import { LIMIT } from '@common/variables';
import { PrismaService } from '@database/prisma.service';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { $Enums } from '@prisma/client';
import SnapLogger from '@utils/SnapLogger';
import { Request } from 'express';
import { PlanValidate, ValidateType } from './plan-validate.decorator';

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
    const registeredUser = req.user;
    const pollId = req.body.pollId;
    const { user } = await this.prisma.poll.findUnique({
      where: { id: pollId },
      include: {
        user: {
          include: {
            subscription: {
              include: { plan: true },
            },
          },
        },
      },
    });
    /* 유저 존재 검증 */
    if (!user) {
      const errorCode = await this.prisma.getErrorCode('user', 'NotFound');
      throw new BadRequestException(errorCode);
    }

    if (
      !user.subscription ||
      user.subscription.endDate !== null ||
      user.subscription.state !== 'Active'
    ) {
      const errorCode = await this.prisma.getErrorCode('plan', 'Forbidden');
      throw new ForbiddenException(errorCode);
    }

    this.logger.info(`${validateType} 작업 진행`);

    const UPPER_CASE =
      user.subscription.plan.planType.toUpperCase() as keyof typeof LIMIT;

    if (user.subscription.type in $Enums.SubscribeType) {
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
          // 플랜 별 응답 수 제한 검증
          if (count >= LIMIT[UPPER_CASE].RESPONSE.POLL) {
            const errorCode = await this.prisma.getErrorCode(
              'pollResponse',
              'PollResponseLimit',
            );
            throw new BadRequestException(errorCode);
          }
          if (registeredUser) {
            /* 이미 응답했는지 검증 */
            const alreadyRespond = await this.prisma.response.count({
              where: { pollId, userId: registeredUser.id },
            });
            if (alreadyRespond > 0) {
              const errorCode = await this.prisma.getErrorCode(
                'pollResponse',
                'AlreadyRespond',
              );
              throw new BadRequestException(errorCode);
            }
          }
        } else {
          // 조작된 바디 데이터 예외 처리
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
        // 플랜 별 응답 수 제한 검증
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
          if (registeredUser) {
            /* 이미 응답했는지 검증 */
            const alreadyRespond = await this.prisma.voteResponse.count({
              where: { voteId, userId: user.id },
            });
            if (alreadyRespond > 0) {
              const errorCode = await this.prisma.getErrorCode(
                'voteResponse',
                'AlreadyRespond',
              );
              throw new BadRequestException(errorCode);
            }
          }
        } else {
          // 조작된 바디 데이터 예외 처리
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
