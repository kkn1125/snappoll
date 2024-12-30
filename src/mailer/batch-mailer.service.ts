import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import SnapLogger from '@utils/SnapLogger';
import { MailerService } from './mailer.service';

@Injectable()
export class BatchMailerService {
  logger = new SnapLogger(this);

  constructor(private readonly mailerService: MailerService) {}

  @Cron('59 59 23 * * *', {
    name: 'sendManualMail',
  })
  batchMailer() {
    this.logger.debug('메뉴얼 메일 발송 테스트');
    // this.mailerService.sendManualMail()
  }
}
