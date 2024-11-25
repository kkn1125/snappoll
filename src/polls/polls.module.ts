import { Module } from '@nestjs/common';
import { PollsService } from './polls.service';
import { PollsController } from './polls.controller';
import { PrismaService } from '@database/prisma.service';
import { ResultsModule } from './results/results.module';
import { RouterModule } from '@nestjs/core';

@Module({
  controllers: [PollsController],
  imports: [
    ResultsModule,
    RouterModule.register([
      {
        path: 'polls',
        module: ResultsModule,
      },
    ]),
  ],
  providers: [PrismaService, PollsService],
})
export class PollsModule {}
