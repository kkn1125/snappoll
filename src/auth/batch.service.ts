import { PrismaService } from '@database/prisma.service';
import SnapLoggerService from '@logger/logger.service';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import dayjs from 'dayjs';

@Injectable()
export class BatchService {
  cacheTime: number = 1 * 60 * 1000;
  mapper: Map<
    string,
    {
      email: string;
      start: number;
      resolve: <T extends { token: string } | boolean>(value: T) => void;
      expired?: boolean;
    }
  > = new Map();

  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: SnapLoggerService,
  ) {}

  @Cron('*/30 * * * * *', {
    name: 'expiresToken',
  })
  triggerNotifications() {
    const temp = [];
    this.mapper.forEach(({ expired, resolve, start, email }, key) => {
      const gap = Date.now() - start;
      if (!expired && this.cacheTime < gap) {
        const mapper = this.mapper.get(key);
        Object.assign(mapper, { resolve, start, email, expired: true });
        temp.push(key);
      }
    });
    // console.log(`tokens expired: ${temp.length} /`, temp);
  }
  @Cron('0 */20 * * * *', {
    name: 'removeTokens',
  })
  removeExpiredToken() {
    const temp = [];
    this.mapper.forEach(({ expired }, key) => {
      if (expired) {
        temp.push(key);
        this.mapper.delete(key);
      }
    });
    // console.log(`tokens remove: ${temp.length} /`, temp);
  }

  clearTokenIfExists(data: { token: string } | boolean) {
    if (data && data instanceof Object && 'token' in data) {
      this.mapper.delete(data.token);
    }
  }

  @Cron('59 59 23 * * 0', {
    name: 'removeDeletedUser',
  })
  async removeDeletedUser() {
    this.logger.info('제거 시각:', dayjs().format('YYYY. MM. DD HH:mm:ss'));
    const deletedUser = await this.prisma.user.findMany({
      where: { deletedAt: { not: null } },
    });
    const deletedCount = await this.prisma.user.deleteMany({
      where: { deletedAt: { not: null } },
    });
    this.logger.info(
      `제거 계정 목록 (${deletedCount}개 계정)`,
      '=====',
      deletedUser
        .map(({ id, username, email }) => `${id}:\n${username}\n${email} <<✨`)
        .join('\n\n'),
      '=====',
    );
  }
}
