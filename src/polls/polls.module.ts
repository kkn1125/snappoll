import { Module } from '@nestjs/common';
import { PollsService } from './polls.service';
import { PollsController } from './polls.controller';
import { PrismaService } from '@database/prisma.service';
import { ResultsModule } from './results/results.module';
import { RouterModule } from '@nestjs/core';
import { AuthService } from '@/auth/auth.service';

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
  providers: [AuthService, PrismaService, PollsService],
})
export class PollsModule {}
