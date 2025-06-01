import { EventsModule } from '@/events/events.module';
import { AuthModule } from '@auth/auth.module';
import { PrismaService } from '@database/prisma.service';
import { Module } from '@nestjs/common';
import { EncryptManager } from '@utils/EncryptManager';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
@Module({
  imports: [AuthModule, EventsModule],
  controllers: [BoardsController],
  providers: [PrismaService, BoardsService, EncryptManager],
  exports: [BoardsService],
})
export class BoardsModule {}
