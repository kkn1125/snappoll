import { MailerModule } from '@/mailer/mailer.module';
import commonConf from '@common/common.conf';
import { PrismaService } from '@database/prisma.service';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BasicController } from './basic.controller';
import { BasicService } from './basic.service';
import { DatabaseModule } from '@database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [commonConf] }),
    DatabaseModule,
    MailerModule,
  ],
  controllers: [BasicController],
  providers: [ConfigService, BasicService],
})
export class BasicModule {}
