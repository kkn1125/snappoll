import { Module } from '@nestjs/common';
import { PollsService } from './polls.service';
import { PollsController } from './polls.controller';
import { PrismaService } from '@database/prisma.service';

@Module({
  controllers: [PollsController],
  providers: [PrismaService, PollsService],
})
export class PollsModule {}
