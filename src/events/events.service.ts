import { PrismaService } from '@database/prisma.service';
import SnapLoggerService from '@logger/logger.service';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';

@Injectable()
export class EventsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: SnapLoggerService,
  ) {}

  @Cron('0 0 0 * * *')
  async notifyWebhook() {
    const signupCountWebhook = await this.prisma.webhook.findFirst({
      where: {
        active: true,
        type: 'signup-count',
        domain: 'discord',
      },
    });

    if (signupCountWebhook) {
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

      const response = await axios.post(signupCountWebhook.webhookUrl, {
        content: `최근 30일 가입자 수: ${signupCount}\n총 가입자 수: ${totalUserCount}`,
      });

      this.logger.info(response.data);
    }
  }
}
