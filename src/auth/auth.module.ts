import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '@database/prisma.service';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '@users/users.module';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [PassportModule, UsersModule],
  providers: [PrismaService, AuthService, LocalStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
