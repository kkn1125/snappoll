import { AuthModule } from '@auth/auth.module';
import { PrismaService } from '@database/prisma.service';
import { Module } from '@nestjs/common';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { EncryptManager } from '@utils/EncryptManager';
@Module({
  imports: [AuthModule],
  controllers: [BoardsController],
  providers: [PrismaService, BoardsService, EncryptManager],
  exports: [BoardsService],
})
export class BoardsModule {}
