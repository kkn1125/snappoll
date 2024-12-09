import { MailerModule } from '@/mailer/mailer.module';
import { PrismaService } from '@database/prisma.service';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from '@users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { BatchService } from './batch.service';

@Module({
  imports: [PassportModule, MailerModule],
  providers: [
    PrismaService,
    AuthService,
    UsersService,
    LocalStrategy,
    BatchService,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
