import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RoleGuard } from '@/auth/role.guard';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { File } from 'buffer';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(RoleGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(RoleGuard)
  @Get('me')
  findMe(@Req() req: Request) {
    return req.user;
  }

  @UseGuards(RoleGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(RoleGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(RoleGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Put(':id/profile')
  async uploadProfile(@Param('id') id: string, @UploadedFile() file) {
    return await this.usersService.uploadProfile(id, Buffer.from(file.buffer));
  }

  @UseGuards(RoleGuard)
  @Delete(':id/profile')
  deleteProfileImage(@Param('id') id: string) {
    return this.usersService.deleteProfileImage(id);
  }

  @UseGuards(RoleGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
