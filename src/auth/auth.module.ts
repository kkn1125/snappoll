import { MailerModule } from '@/mailer/mailer.module';
import { PrismaService } from '@database/prisma.service';
import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from '@users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BatchService } from './batch.service';
import { LocalStrategy } from './local.strategy';
import { DatabaseModule } from '@database/database.module';

@Module({
  imports: [
    forwardRef(() => MailerModule),
    DatabaseModule,
    PassportModule,
    HttpModule,
  ],
  providers: [AuthService, UsersService, LocalStrategy, BatchService],
  controllers: [AuthController],
  exports: [AuthService, BatchService],
})
export class AuthModule {}
