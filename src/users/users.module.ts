import { PrismaService } from '@database/prisma.service';
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '@/auth/auth.service';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [AuthService, PrismaService, UsersService],
})
export class UsersModule {}
