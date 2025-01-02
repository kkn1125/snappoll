import { AuthModule } from '@auth/auth.module';
import { DatabaseModule } from '@database/database.module';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from './mailer.service';
import { MailerController } from './mailer.controller';
import { EncryptManager } from '@utils/EncryptManager';
import { BatchMailerService } from './batch-mailer.service';

@Module({
  imports: [forwardRef(() => AuthModule), DatabaseModule],
  controllers: [MailerController],
  providers: [ConfigService, MailerService, EncryptManager, BatchMailerService],
  exports: [MailerService],
})
export class MailerModule {}
