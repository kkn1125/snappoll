import { AuthModule } from '@auth/auth.module';
import { PrismaService } from '@database/prisma.service';
import { Module } from '@nestjs/common';
import { ResponseController } from './response.controller';
import { ResponseService } from './response.service';

@Module({
  imports: [AuthModule],
  controllers: [ResponseController],
  providers: [PrismaService, ResponseService],
})
export class ResponseModule {}
