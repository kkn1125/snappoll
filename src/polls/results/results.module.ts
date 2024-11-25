import { Module } from '@nestjs/common';
import { ResultsService } from './results.service';
import { ResultsController } from './results.controller';
import { PrismaService } from '@database/prisma.service';
import { AuthService } from '@/auth/auth.service';

@Module({
  controllers: [ResultsController],
  providers: [AuthService, PrismaService, ResultsService],
})
export class ResultsModule {}
