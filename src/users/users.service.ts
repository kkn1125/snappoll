import { PrismaService } from '@database/prisma.service';
import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { EncryptManager } from '@utils/EncryptManager';
import { snakeToCamel } from '@utils/snakeToCamel';
import SnapLogger from '@utils/SnapLogger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  // async getProfileImageTest() {
  //   const { data } = await this.httpService.axiosRef.get(
  //     'https://k.kakaocdn.net/dn/cP0QlW/btsBgdcPoks/P7z3aErKm7e30Jsot6YTj1/img_110x110.jpg',
  //     {
  //       responseType: 'arraybuffer',
  //     },
  //   );

  //   return data;
  // }
  logger = new SnapLogger(this);

  constructor(
    private readonly httpService: HttpService,
    private readonly encryptManager: EncryptManager,
    // private readonly logger: SnapLogger,
    private readonly prisma: PrismaService,
  ) {}

  findOneByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async getProfileImage(profileId: string) {
    const image = await this.prisma.userProfile.findUnique({
      where: { id: profileId },
    });
    if (!image) {
      const errorCode = await this.prisma.getErrorCode(
        'userProfile',
        'NotFound',
      );
      throw new NotFoundException(errorCode);
    }
    return image;
  }

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

  async passwordToEncrypt(createUserDto: CreateUserDto) {
    if (
      !(createUserDto.email && createUserDto.password && createUserDto.username)
    ) {
      const errorCode = await this.prisma.getErrorCode('user', 'RequiredData');
      throw new BadRequestException(errorCode);
    }

    const password = this.encryptManager.encryptData(createUserDto.password);
    // createUserDto.password = password;
    this.logger.info('encrypted:', createUserDto.password);
    return password;
  }

  async create(
    privacyPolicy: boolean,
    serviceAgreement: boolean,
    createUserDto: CreateUserDto,
  ) {
    if (!privacyPolicy || !serviceAgreement) {
      const errorCode = await this.prisma.getErrorCode(
        'user',
        'RequireAgreement',
      );
      throw new BadRequestException(errorCode);
    }

    if (!createUserDto.authProvider) {
      createUserDto.authProvider = $Enums.AuthProvider.Local;
    }

    /* 역할 고정 */
    // createUserDto.role = $Enums.Role.User;

    if (!createUserDto.plan) {
      createUserDto.plan = $Enums.PlanType.Free;
      createUserDto.subscribeType = $Enums.SubscribeType.Infinite;
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

    const { role, password, provider, plan, subscribeType, ...userCommon } =
      createUserDto;
    const orFreePlan = await this.prisma.plan.findFirst({
      where: { planType: plan || $Enums.PlanType.Free },
    });

    if (createUserDto.authProvider === $Enums.AuthProvider.Local) {
      const encryptedPassword = await this.passwordToEncrypt(createUserDto);
      return this.prisma.user.create({
        data: {
          ...userCommon,
          role: $Enums.Role.User,
          localUser: { create: { password: encryptedPassword } },
          subscription: {
            create: {
              planId: orFreePlan.id,
              type:
                plan === $Enums.PlanType.Free
                  ? $Enums.SubscribeType.Infinite
                  : subscribeType || $Enums.SubscribeType.Monthly,
            },
          },
        },
        include: { localUser: true, subscription: true },
      });
    } else {
      return this.prisma.user.create({
        data: {
          ...userCommon,
          role: $Enums.Role.User,
          socialUser: { create: { provider } },
          subscription: {
            create: {
              planId: orFreePlan.id,
              type:
                plan === $Enums.PlanType.Free
                  ? $Enums.SubscribeType.Infinite
                  : subscribeType || $Enums.SubscribeType.Monthly,
            },
          },
        },
        include: { socialUser: true, subscription: true },
      });
    }
  }

  async findAll(page: number) {
    const columnList = (await this.prisma.$queryRaw`SELECT
          COLUMN_NAME column
        FROM
          INFORMATION_SCHEMA.COLUMNS
        WHERE
          TABLE_NAME = 'user'
        ORDER BY
          ORDINAL_POSITION;`) as { column: string }[];
    const columns = columnList.map(({ column }) => snakeToCamel(column));
    const users = await this.prisma.user.findMany({
      skip: (page - 1) * 10,
      take: 10,
    });
    const count = await this.prisma.user.count();
    return { columns, users, count };
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

  async uploadProfile(id: string, file: Express.Multer.File) {
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId: id },
    });
    if (profile) {
      return this.prisma.userProfile.update({
        where: { userId: id },
        data: {
          filename: file.originalname,
          image: file.buffer,
          mimetype: file.mimetype,
        },
      });
    } else {
      return this.prisma.userProfile.create({
        data: {
          userId: id,
          filename: file.originalname,
          image: file.buffer,
          mimetype: file.mimetype,
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
      this.encryptManager.encryptData(currentPassword);

    // console.log('currentPassword:', currentPassword);

    if (user.localUser.password !== encryptedCurrentPassword) {
      const errorCode = await this.prisma.getErrorCode('user', 'CheckUserData');
      throw new BadRequestException(errorCode);
    }

    const encryptedPassword = this.encryptManager.encryptData(
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
