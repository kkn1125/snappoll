import { AuthModule } from '@auth/auth.module';
import { DatabaseModule } from '@database/database.module';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from './mailer.service';
import { MailerController } from './mailer.controller';
import { EncryptManager } from '@utils/EncryptManager';

@Module({
  imports: [forwardRef(() => AuthModule), DatabaseModule],
  controllers: [MailerController],
  providers: [ConfigService, MailerService, EncryptManager],
  exports: [MailerService],
})
export class MailerModule {}
