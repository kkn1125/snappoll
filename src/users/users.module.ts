import { AuthModule } from '@auth/auth.module';
import { DatabaseModule } from '@database/database.module';
import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { EncryptManager } from '@utils/EncryptManager';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TermsModule } from '@/terms/terms.module';

@Module({
  imports: [
    HttpModule,
    DatabaseModule,
    forwardRef(() => AuthModule),
    TermsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, EncryptManager],
  exports: [UsersService],
})
export class UsersModule {}
