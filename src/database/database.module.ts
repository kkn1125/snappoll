import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma.service';

@Module({
  imports: [],
  providers: [ConfigService, PrismaService],
})
export class DatabaseModule {}
