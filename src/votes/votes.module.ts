import { AuthModule } from '@auth/auth.module';
import { PrismaService } from '@database/prisma.service';
import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { VoteResponsesModule } from './vote-responses/vote-responses.module';
import { VotesController } from './votes.controller';
import { VotesService } from './votes.service';

@Module({
  imports: [
    AuthModule,
    VoteResponsesModule,
    RouterModule.register([{ path: 'votes', module: VoteResponsesModule }]),
  ],
  controllers: [VotesController],
  providers: [PrismaService, VotesService],
})
export class VotesModule {}
