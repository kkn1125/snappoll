import { AuthModule } from '@auth/auth.module';
import { PrismaService } from '@database/prisma.service';
import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { EncryptManager } from '@utils/EncryptManager';
import { PollsController } from './polls.controller';
import { PollsService } from './polls.service';
import { ResponseModule } from './response/response.module';

@Module({
  imports: [
    AuthModule,
    ResponseModule,
    RouterModule.register([
      {
        path: 'polls',
        module: ResponseModule,
      },
    ]),
    // ResponseModule,
  ],
  controllers: [PollsController],
  providers: [PrismaService, PollsService, EncryptManager],
})
export class PollsModule {}
