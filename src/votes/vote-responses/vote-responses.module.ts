import { Module } from '@nestjs/common';
import { VoteResponsesService } from './vote-responses.service';
import { VoteResponsesController } from './vote-responses.controller';
import { VoteOptionsModule } from './vote-options/vote-options.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    RouterModule.register([
      { path: 'vote-responses', module: VoteOptionsModule },
    ]),
    VoteOptionsModule,
  ],
  controllers: [VoteResponsesController],
  providers: [VoteResponsesService],
})
export class VoteResponsesModule {}
