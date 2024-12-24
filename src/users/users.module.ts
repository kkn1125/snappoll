import { AuthModule } from '@auth/auth.module';
import { DatabaseModule } from '@database/database.module';
import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { EncryptManager } from '@utils/EncryptManager';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [HttpModule, DatabaseModule, forwardRef(() => AuthModule)],
  controllers: [UsersController],
  providers: [UsersService, EncryptManager],
  exports: [UsersService],
})
export class UsersModule {}
