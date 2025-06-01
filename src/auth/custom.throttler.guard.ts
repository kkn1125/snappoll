import SnapLoggerService from '@logger/logger.service';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  ThrottlerException,
  ThrottlerGuard,
  ThrottlerLimitDetail,
  ThrottlerModuleOptions,
  ThrottlerStorage,
} from '@nestjs/throttler';
import { PrismaClient } from '@prisma/client';
import {
  ErrorCode,
  ErrorCodeType,
  ErrorMessage,
  ErrorMessageType,
} from '@utils/codes';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  prisma = new PrismaClient();

  constructor(
    protected readonly options: ThrottlerModuleOptions, // Throttler 옵션 추가
    protected readonly storageService: ThrottlerStorage, // 스토리지 서비스 추가
    protected readonly reflector: Reflector, // Reflector 추가
    private readonly logger: SnapLoggerService,
  ) {
    super(options, storageService, reflector); // 부모 클래스 생성자 호출
  }

  canActivate(context: ExecutionContext): Promise<boolean> {
    // this.logger.info('리플렉터', this.reflector);
    // 1. `@SkipThrottle` 메타데이터 확인
    const isThrottled = this.reflector.get<boolean>(
      'THROTTLER:IGNORE',
      context.getHandler(),
      // [context.getHandler(), context.getClass()],
    );

    // this.logger.info('스로틀 무시 ?', isThrottled);
    if (isThrottled) {
      // this.logger.info('스로틀 무시');
      return Promise.resolve(true); // 스로틀링 검사 건너뛰기
    }

    // 2. 부모 클래스의 기본 로직 호출
    return super.canActivate(context);
  }

  protected async throwThrottlingException(
    context: ExecutionContext,
    throttlerLimitDetail: ThrottlerLimitDetail,
  ): Promise<void> {
    // const isThrottled = this.reflector.getAllAndOverride<boolean>(
    //   'THROTTLER:SKIP',
    //   [context.getHandler(), context.getClass()],
    // );

    // this.logger.info('스로틀 무시 시도:', isThrottled);
    // if (isThrottled) {
    //   this.logger.info('스로틀 무시');
    //   return; // 스로틀링 검사 건너뛰기
    // }

    const errorCode = await this.getErrorCode('common', 'TooManyRequest');
    throw new ThrottlerException(errorCode.message);
  }

  async getErrorCode<
    Domain extends ErrorCodeType[number],
    Name extends Domain[1],
    Message extends ErrorMessageType[Name][number][1],
  >(code: Name, errorCode: Message): Promise<CustomErrorFormat> {
    const [status] = ErrorCode.find((ec) => ec[1] === code);
    const [errorStatus] = ErrorMessage[code].find((em) => em[1] === errorCode);

    const result: CustomErrorFormat = await this.prisma.$queryRaw`
      SELECT
        code.status AS status,
        code.domain AS domain,
        error_message.status AS "errorStatus",
        error_message.message AS message
      FROM code
      LEFT JOIN error_message
        ON code.domain = error_message.code_domain
      WHERE code.status = ${status}
        AND error_message.status = ${errorStatus}
    `;
    return result[0];
  }
}
