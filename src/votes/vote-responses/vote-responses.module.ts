import { Module } from '@nestjs/common';
import { VoteResponsesService } from './vote-responses.service';
import { VoteResponsesController } from './vote-responses.controller';
import { VoteOptionsModule } from './vote-options/vote-options.module';
import { RouterModule } from '@nestjs/core';
import { PrismaService } from '@database/prisma.service';

@Module({
  imports: [
    RouterModule.register([
      { path: 'vote-responses', module: VoteOptionsModule },
    ]),
    VoteOptionsModule,
  ],
  controllers: [VoteResponsesController],
  providers: [PrismaService, VoteResponsesService],
})
export class VoteResponsesModule {}
