import commonConf from '@common/common.conf';
import { PrismaService } from '@database/prisma.service';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BasicController } from './basic.controller';
import { BasicService } from './basic.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [commonConf] })],
  controllers: [BasicController],
  providers: [ConfigService, BasicService, PrismaService],
})
export class BasicModule {}
