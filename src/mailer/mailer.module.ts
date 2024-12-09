import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [ConfigService, MailerService],
  exports: [MailerService],
})
export class MailerModule {}
