import { Module } from '@nestjs/common';
import { ResultsService } from './results.service';
import { ResultsController } from './results.controller';
import { PrismaService } from '@database/prisma.service';

@Module({
  controllers: [ResultsController],
  providers: [PrismaService, ResultsService],
})
export class ResultsModule {}
