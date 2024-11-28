import { Module } from '@nestjs/common';
import { VotesService } from './votes.service';
import { VotesController } from './votes.controller';
import { PrismaService } from '@database/prisma.service';
import { AuthService } from '@/auth/auth.service';

@Module({
  controllers: [VotesController],
  providers: [AuthService, PrismaService, VotesService],
})
export class VotesModule {}
