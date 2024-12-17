import { PrismaService } from '@database/prisma.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { $Enums } from '@prisma/client';
import Logger from '@utils/Logger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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
      const errorCode = await this.prisma.getErrorCode('user', 'RequiredData');
      throw new BadRequestException(errorCode);
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
      const errorCode = await this.prisma.getErrorCode(
        'user',
        'AlreadyUsedEmail',
      );
      throw new BadRequestException(errorCode);
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
      const errorCode = await this.prisma.getErrorCode('user', 'NotFound');
      throw new NotFoundException(errorCode);
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
    if (!currentPassword || currentPassword === updateUserDto.password) {
      const errorCode = await this.prisma.getErrorCode('user', 'BadRequest');
      throw new BadRequestException(errorCode);
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { localUser: true, socialUser: true },
    });

    if (user.authProvider !== $Enums.AuthProvider.Local) {
      const errorCode = await this.prisma.getErrorCode('user', 'BadRequest');
      throw new BadRequestException(errorCode);
    }

    const encryptedCurrentPassword =
      this.prisma.encryptPassword(currentPassword);

    // console.log('currentPassword:', currentPassword);

    if (user.localUser.password !== encryptedCurrentPassword) {
      const errorCode = await this.prisma.getErrorCode('user', 'CheckUserData');
      throw new BadRequestException(errorCode);
    }

    const encryptedPassword = this.prisma.encryptPassword(
      updateUserDto.password,
    );
    // console.log(id, user.localUser.password, encryptedPassword);
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
