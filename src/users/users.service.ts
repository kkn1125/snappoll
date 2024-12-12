import { PrismaService } from '@database/prisma.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';

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

    createUserDto.username += await this.getNextUserNumber(
      createUserDto.username,
    );

    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      where: { deletedAt: null },
    });
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id, deletedAt: null },
    });
  }

  async uploadProfile(id: string, image: Buffer) {
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId: id },
    });
    if (profile) {
      return this.prisma.userProfile.update({
        where: { userId: id },
        data: {
          image,
        },
      });
    } else {
      return this.prisma.userProfile.create({
        data: {
          userId: id,
          image,
        },
      });
    }
  }

  deleteProfileImage(id: string) {
    return this.prisma.userProfile.deleteMany({ where: { userId: id } });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const { username } = updateUserDto;
    return this.prisma.user.update({
      where: { id, deletedAt: null },
      data: {
        username,
      },
    });
  }

  async updatePassword(
    id: string,
    currentPassword: string,
    updateUserDto: UpdateUserPasswordDto,
  ) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    const encryptedCurrentPassword =
      this.prisma.encryptPassword(currentPassword);

    console.log('currentPassword:', currentPassword);

    if (user.password !== encryptedCurrentPassword) {
      throw new BadRequestException(
        '잘못된 정보입니다. 비밀번호를 확인해주세요.',
      );
    }

    const encryptedPassword = this.prisma.encryptPassword(
      updateUserDto.password,
    );
    console.log(id, encryptedPassword);
    return this.prisma.user.update({
      where: { id, deletedAt: null },
      data: {
        password: encryptedPassword,
      },
    });
  }

  remove(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
