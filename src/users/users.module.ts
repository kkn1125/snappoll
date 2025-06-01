import { EventsModule } from '@/events/events.module';
import { TermsModule } from '@/terms/terms.module';
import { AuthModule } from '@auth/auth.module';
import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { EncryptManager } from '@utils/EncryptManager';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    HttpModule,
    TermsModule,
    EventsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, EncryptManager],
  exports: [UsersService],
})
export class UsersModule {}
