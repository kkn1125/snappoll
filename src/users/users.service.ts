import { PrismaService } from '@database/prisma.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { $Enums } from '@prisma/client';
import { ErrorCodeType } from '@utils/codes';
import Logger from '@utils/Logger';

@Injectable()
export class UsersService {
  logger = new Logger(this);

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

  async createLocalUser(createUserDto: CreateUserDto) {
    if (
      !(createUserDto.email && createUserDto.password && createUserDto.username)
    ) {
      throw new BadRequestException('입력 정보가 누락되었습니다.');
    }

    const password = this.prisma.encryptPassword(createUserDto.password);
    createUserDto.password = password;
  }

  async create(createUserDto: CreateUserDto) {
    if (!createUserDto.authProvider) {
      createUserDto.authProvider = $Enums.AuthProvider.Local;
    }
    if (!createUserDto.role) {
      createUserDto.role = $Enums.Role.User;
    }
    if (!createUserDto.grade) {
      createUserDto.grade = $Enums.Grade.Free;
    }

    const existsUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (!!existsUser) {
      throw new BadRequestException('이메일이 중복됩니다.', {
        cause: createUserDto.email,
      });
    }

    createUserDto.username += await this.getNextUserNumber(
      createUserDto.username,
    );

    if (createUserDto.authProvider === $Enums.AuthProvider.Local) {
      await this.createLocalUser(createUserDto);
      const { password, provider, ...userCommon } = createUserDto;
      this.logger.debug(password);

      return this.prisma.user.create({
        data: { ...userCommon, localUser: { create: { password } } },
        include: { localUser: true },
      });
    } else {
      const { password, provider, ...userCommon } = createUserDto;

      return this.prisma.user.create({
        data: { ...userCommon, socialUser: { create: { provider } } },
        include: { socialUser: true },
      });
    }
  }

  findAll() {
    return this.prisma.user.findMany({
      where: { deletedAt: null },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
    });

    if (!user) {
      const { message, ...status } = await this.prisma.getErrorCode(
        'user',
        'NotFound',
      );
      this.logger.debug('message:', message);
      this.logger.debug('status:', status);
      throw new NotFoundException(message, { cause: status });
    }

    this.logger.debug('사용자 찾기:', user);
    return user;
  }

  async uploadProfile(id: string, imagePath: string) {
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId: id },
    });
    if (profile) {
      return this.prisma.userProfile.update({
        where: { userId: id },
        data: {
          image: imagePath,
        },
      });
    } else {
      return this.prisma.userProfile.create({
        data: {
          userId: id,
          image: imagePath,
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
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { localUser: true, socialUser: true },
    });

    if (user.authProvider !== $Enums.AuthProvider.Local) {
      const { message, ...status } = await this.prisma.getErrorCode(
        'server',
        'BadRequest',
      );

      throw new BadRequestException(message, { cause: status });
    }

    const encryptedCurrentPassword =
      this.prisma.encryptPassword(currentPassword);

    console.log('currentPassword:', currentPassword);

    if (user.localUser.password !== encryptedCurrentPassword) {
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
        localUser: {
          update: {
            password: encryptedPassword,
          },
        },
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
