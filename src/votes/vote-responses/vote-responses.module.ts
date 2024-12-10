import { AuthModule } from '@auth/auth.module';
import { PrismaService } from '@database/prisma.service';
import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { VoteOptionsModule } from './vote-options/vote-options.module';
import { VoteResponsesController } from './vote-responses.controller';
import { VoteResponsesService } from './vote-responses.service';

@Module({
  imports: [
    RouterModule.register([{ path: 'response', module: VoteOptionsModule }]),
    AuthModule,
    VoteOptionsModule,
  ],
  controllers: [VoteResponsesController],
  providers: [PrismaService, VoteResponsesService],
})
export class VoteResponsesModule {}
