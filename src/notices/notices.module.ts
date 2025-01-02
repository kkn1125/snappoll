import { Module } from '@nestjs/common';
import { NoticesService } from './notices.service';
import { NoticesController } from './notices.controller';
import { DatabaseModule } from '@database/database.module';
import { MailerModule } from '@/mailer/mailer.module';

@Module({
  imports: [DatabaseModule, MailerModule],
  controllers: [NoticesController],
  providers: [NoticesService],
})
export class NoticesModule {}
