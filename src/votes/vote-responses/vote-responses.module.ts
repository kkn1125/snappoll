import { AuthModule } from '@auth/auth.module';
import { PrismaService } from '@database/prisma.service';
import { Module } from '@nestjs/common';
import { VoteResponsesController } from './vote-responses.controller';
import { VoteResponsesService } from './vote-responses.service';

@Module({
  imports: [AuthModule],
  controllers: [VoteResponsesController],
  providers: [PrismaService, VoteResponsesService],
})
export class VoteResponsesModule {}
