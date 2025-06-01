import { PrismaService } from '@database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EventsService } from './events.service';

@Injectable()
export class ScheduleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService,
  ) {}

  /* 최근 30일 가입자 수와 총 가입자 수를 카테고리 웹훅으로 전송 */
  @Cron('0 0 0 * * *')
  async notifySignupUserCount() {
    const signupCount = await this.prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
        },
      },
    });
    const totalUserCount = await this.prisma.user.count({
      where: { deletedAt: null },
    });
    const content = `최근 30일 가입자 수: ${signupCount}\n총 가입자 수: ${totalUserCount}`;

    await this.eventsService.notifyWebhook('discord', 'signup-count', content);
  }
}
