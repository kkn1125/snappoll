import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '@database/prisma.service';
import { first } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getNextUserNumber(username: string) {
    const first = await this.prisma.user.findFirst({
      where: {
        username: {
          startsWith: username,
        },
      },
      orderBy: { username: 'desc' },
    });
    if (first) {
      const numberString = first.username.replace(/[ㄱ-ㅎ가-힣]+/g, '');
      if (numberString === '') {
        return '0000001';
      } else {
        return (parseInt(numberString) + 1).toString().padStart(7, '0');
      }
    }
    return '';
  }

  async create(createUserDto: CreateUserDto) {
    if (
      !(createUserDto.email && createUserDto.password && createUserDto.username)
    ) {
      throw new BadRequestException('입력 정보가 누락되었습니다.');
    }

    const existsUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (!!existsUser) {
      throw new BadRequestException('이메일이 중복됩니다.', {
        cause: createUserDto.email,
      });
    }

    const password = this.prisma.encryptPassword(createUserDto.password);
    createUserDto.password = password;

    createUserDto.username += this.getNextUserNumber(createUserDto.username);

    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  uploadProfile(id: string, image: Buffer) {
    return this.prisma.userProfile.create({
      data: {
        userId: id,
        image,
      },
    });
  }

  deleteProfileImage(id: string) {
    return this.prisma.userProfile.deleteMany({ where: { userId: id } });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({ where: { id }, data: updateUserDto });
  }

  remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
