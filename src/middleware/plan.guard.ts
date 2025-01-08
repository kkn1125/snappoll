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
import { $Enums, Plan, Subscription, User } from '@prisma/client';
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

  async validateIfMember(registeredUser: Express.Request['user']) {
    /* 유저 존재 검증 */
    if (!registeredUser) {
      const errorCode = await this.prisma.getErrorCode('user', 'NotFound');
      throw new BadRequestException(errorCode);
    }

    /* 유저 구독 데이터 검증 */
    if (
      !registeredUser.subscription ||
      registeredUser.subscription.endDate !== null ||
      registeredUser.subscription.state !== 'Active'
    ) {
      const errorCode = await this.prisma.getErrorCode('plan', 'Forbidden');
      throw new ForbiddenException(errorCode);
    }
  }

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
    // id 값이 있으면 응답, 없으면 생성
    const pollId = req.body.pollId;
    const voteId = req.body.voteId;
    let pollOrVoteAuthor: User & {
      subscription: Subscription & { plan: Plan };
    };
    // let voteAuthor: User & { subscription: Subscription & { plan: Plan } };
    if (pollId) {
      const poll = await this.prisma.poll.findUnique({
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
      pollOrVoteAuthor = poll.user;
    }

    if (!pollId && !registeredUser) {
      const errorCode = await this.prisma.getErrorCode('server', 'BadRequest');
      throw new BadRequestException(errorCode);
    }

    this.logger.info(`${validateType} 작업 진행`);

    if (validateType === 'pollCreate') {
      await this.validateIfMember(registeredUser);
      const LIMIT_TYPE =
        registeredUser.subscription.plan.planType.toUpperCase();
      const count = await this.prisma.poll.count({
        where: { userId: registeredUser.id },
      });
      if (count >= LIMIT[LIMIT_TYPE].CREATE.POLL) {
        const errorCode = await this.prisma.getErrorCode('poll', 'PollLimit');
        throw new BadRequestException(errorCode);
      }
    } else if (validateType === 'pollResponse') {
      const LIMIT_TYPE =
        pollOrVoteAuthor.subscription.plan.planType.toUpperCase();
      if ('pollId' in req.body) {
        const count = await this.prisma.response.count({
          where: { pollId },
        });
        // 플랜 별 응답 수 제한 검증
        if (count >= LIMIT[LIMIT_TYPE].RESPONSE.POLL) {
          const errorCode = await this.prisma.getErrorCode(
            'pollResponse',
            'PollResponseLimit',
          );
          throw new BadRequestException(errorCode);
        }
        // 회원의 경우
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
        // 비회원은 통과
      } else {
        // 조작된 바디 데이터 예외 처리
        const errorCode = await this.prisma.getErrorCode(
          'pollResponse',
          'BadRequest',
        );
        throw new BadRequestException(errorCode);
      }
    } else if (validateType === 'voteCreate') {
      await this.validateIfMember(registeredUser);
      const LIMIT_TYPE =
        registeredUser.subscription.plan.planType.toUpperCase();
      const count = await this.prisma.vote.count({
        where: { userId: registeredUser.id },
      });
      // 플랜 별 응답 수 제한 검증
      if (count >= LIMIT[LIMIT_TYPE].CREATE.VOTE) {
        const errorCode = await this.prisma.getErrorCode('vote', 'VoteLimit');
        throw new BadRequestException(errorCode);
      }
    } else if (validateType === 'voteResponse') {
      const LIMIT_TYPE =
        pollOrVoteAuthor.subscription.plan.planType.toUpperCase();
      if ('voteId' in req.body) {
        const count = await this.prisma.voteResponse.count({
          where: { voteId },
        });
        if (count >= LIMIT[LIMIT_TYPE].RESPONSE.VOTE) {
          const errorCode = await this.prisma.getErrorCode(
            'voteResponse',
            'VoteResponseLimit',
          );
          throw new BadRequestException(errorCode);
        }
        // 회원일 경우
        if (registeredUser) {
          /* 이미 응답했는지 검증 */
          const alreadyRespond = await this.prisma.voteResponse.count({
            where: { voteId, userId: registeredUser.id },
          });
          if (alreadyRespond > 0) {
            const errorCode = await this.prisma.getErrorCode(
              'voteResponse',
              'AlreadyRespond',
            );
            throw new BadRequestException(errorCode);
          }
        }
        // 비회원은 통과
      } else {
        // 조작된 바디 데이터 예외 처리
        const errorCode = await this.prisma.getErrorCode(
          'voteResponse',
          'BadRequest',
        );
        throw new BadRequestException(errorCode);
      }
    }

    return true;
  }
}
