import { Module } from '@nestjs/common';
import { VotesService } from './votes.service';
import { VotesController } from './votes.controller';
import { PrismaService } from '@database/prisma.service';

@Module({
  controllers: [VotesController],
  providers: [PrismaService, VotesService],
})
export class VotesModule {}
