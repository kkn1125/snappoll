import { MailerModule } from '@/mailer/mailer.module';
import commonConf from '@common/common.conf';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BasicController } from './basic.controller';
import { BasicService } from './basic.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [commonConf] }),
    MailerModule,
  ],
  controllers: [BasicController],
  providers: [ConfigService, BasicService],
})
export class BasicModule {}
