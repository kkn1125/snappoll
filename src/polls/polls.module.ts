import { AuthModule } from '@auth/auth.module';
import { PrismaService } from '@database/prisma.service';
import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AnswersModule } from './answers/answers.module';
import { PollsController } from './polls.controller';
import { PollsService } from './polls.service';
import { QuestionsModule } from './questions/questions.module';
import { ResponseModule } from './response/response.module';

@Module({
  imports: [
    AuthModule,
    ResponseModule,
    QuestionsModule,
    AnswersModule,
    RouterModule.register([
      {
        path: 'polls',
        module: ResponseModule,
      },
      {
        path: 'polls',
        module: QuestionsModule,
      },
      {
        path: 'polls',
        module: AnswersModule,
      },
    ]),
    // ResponseModule,
    // AnswersModule,
  ],
  controllers: [PollsController],
  providers: [PrismaService, PollsService],
})
export class PollsModule {}
