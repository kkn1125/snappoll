import { AuthModule } from '@auth/auth.module';
import { DatabaseModule } from '@database/database.module';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from './mailer.service';

@Module({
  imports: [forwardRef(() => AuthModule), DatabaseModule],
  controllers: [],
  providers: [ConfigService, MailerService],
  exports: [MailerService],
})
export class MailerModule {}
