import { Module } from '@nestjs/common';
import { VoteOptionsService } from './vote-options.service';
import { VoteOptionsController } from './vote-options.controller';
import { PrismaService } from '@database/prisma.service';

@Module({
  controllers: [VoteOptionsController],
  providers: [PrismaService, VoteOptionsService],
})
export class VoteOptionsModule {}
