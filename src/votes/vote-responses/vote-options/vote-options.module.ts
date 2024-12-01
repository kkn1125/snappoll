import { Module } from '@nestjs/common';
import { VoteOptionsService } from './vote-options.service';
import { VoteOptionsController } from './vote-options.controller';

@Module({
  controllers: [VoteOptionsController],
  providers: [VoteOptionsService],
})
export class VoteOptionsModule {}
