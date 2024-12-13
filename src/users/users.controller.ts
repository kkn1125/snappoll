import { RoleGuard } from '@/auth/role.guard';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { CookieGuard } from '@auth/cookie.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  findMe(@Req() req: Request) {
    return req.user;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @UseInterceptors(FileInterceptor('file'))
  @Put('profile')
  async uploadProfile(
    @Req() req: Request,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: 10000,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    const id = req.user.id;
    const savedPath = file.path;
    return await this.usersService.uploadProfile(id, savedPath);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Put(':id/password')
  updatePassword(
    @Param('id') id: string,
    @Body('currentPassword') currentPassword: string,
    @Body() updateUserDto: UpdateUserPasswordDto,
  ) {
    if (!currentPassword || currentPassword === updateUserDto.password) {
      throw new BadRequestException('잘못된 요청입니다.');
    }
    return this.usersService.updatePassword(id, currentPassword, updateUserDto);
  }

  @Delete('profile')
  deleteProfileImage(@Req() req: Request) {
    const id = req.user.id;
    return this.usersService.deleteProfileImage(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
