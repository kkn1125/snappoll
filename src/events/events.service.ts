import { PrismaService } from '@database/prisma.service';
import SnapLoggerService from '@logger/logger.service';
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class EventsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: SnapLoggerService,
  ) {}

  async notifyWebhook(domain: string, type: string, data: any) {
    const webhook = await this.prisma.webhook.findFirst({
      where: {
        domain,
        type,
        active: true,
      },
    });

    if (webhook) {
      const response = await axios.post(webhook.webhookUrl, {
        content: data,
      });

      this.logger.info(response.data);
    } else {
      this.logger.info('No webhook found', { domain, type });
    }
  }
}
