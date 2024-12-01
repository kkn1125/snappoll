import { AuthService } from '@/auth/auth.service';
import { PrismaService } from '@database/prisma.service';
import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { VoteResponsesModule } from './vote-responses/vote-responses.module';
import { VotesController } from './votes.controller';
import { VotesService } from './votes.service';

@Module({
  imports: [
    VoteResponsesModule,
    RouterModule.register([{ path: 'votes', module: VoteResponsesModule }]),
  ],
  controllers: [VotesController],
  providers: [AuthService, PrismaService, VotesService],
})
export class VotesModule {}
