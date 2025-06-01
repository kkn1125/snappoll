import { MailerModule } from '@/mailer/mailer.module';
import { Module } from '@nestjs/common';
import { NoticesController } from './notices.controller';
import { NoticesService } from './notices.service';

@Module({
  imports: [MailerModule],
  controllers: [NoticesController],
  providers: [NoticesService],
})
export class NoticesModule {}
