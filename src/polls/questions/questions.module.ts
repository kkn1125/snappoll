import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { OptionsModule } from './options/options.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    RouterModule.register([{ path: 'questions', module: OptionsModule }]),
    OptionsModule,
  ],
  controllers: [QuestionsController],
  providers: [QuestionsService],
})
export class QuestionsModule {}
