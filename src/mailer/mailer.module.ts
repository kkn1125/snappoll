import { AuthModule } from '@auth/auth.module';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EncryptManager } from '@utils/EncryptManager';
import { BatchMailerService } from './batch-mailer.service';
import { MailerController } from './mailer.controller';
import { MailerService } from './mailer.service';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [MailerController],
  providers: [ConfigService, MailerService, EncryptManager, BatchMailerService],
  exports: [MailerService],
})
export class MailerModule {}
