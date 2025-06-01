import SnapLoggerService from '@logger/logger.service';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MailerService } from './mailer.service';

@Injectable()
export class BatchMailerService {
  constructor(
    private readonly logger: SnapLoggerService,
    private readonly mailerService: MailerService,
  ) {}

  // @Cron('59 59 23 * * *', {
  //   name: 'sendManualMail',
  // })
  manualMailer() {
    this.logger.debug('메뉴얼 메일 발송 테스트');
  }

  // @Cron('59 59 23 * * *', { name: 'sendBatchMail' })
  sendBatchMailer() {
    this.logger.debug('정기 메일 발송');
    this.mailerService.sendBatchMail();
  }
}
