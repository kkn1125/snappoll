import { ExecutionContext, Injectable } from '@nestjs/common';
import {
  ThrottlerException,
  ThrottlerGuard,
  ThrottlerLimitDetail,
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

  protected async throwThrottlingException(
    context: ExecutionContext,
    throttlerLimitDetail: ThrottlerLimitDetail,
  ): Promise<void> {
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
