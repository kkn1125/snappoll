import { Module } from '@nestjs/common';
import { ResponseService } from './response.service';
import { ResponseController } from './response.controller';
import { PrismaService } from '@database/prisma.service';

@Module({
  imports: [],
  controllers: [ResponseController],
  providers: [PrismaService, ResponseService],
})
export class ResponseModule {}
