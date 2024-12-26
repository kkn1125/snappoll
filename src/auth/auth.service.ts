import { MailerService } from '@/mailer/mailer.service';
import { CURRENT_DOMAIN } from '@common/variables';
import { PrismaService } from '@database/prisma.service';
import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { $Enums, User } from '@prisma/client';
import { UsersService } from '@users/users.service';
import { EncryptManager } from '@utils/EncryptManager';
import SnapLogger from '@utils/SnapLogger';
import * as jwt from 'jsonwebtoken';
import * as path from 'path';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  logger = new SnapLogger(this);

  constructor(
    public readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly usersService: UsersService,
    private readonly mailer: MailerService,
    private readonly encryptManager: EncryptManager,
  ) {}

  async createOrIgnore(data: any, userData: jwt.JwtPayload) {
    let user: User = await this.usersService.findOneByEmail(userData.email);
    if (!user) {
      const { data: bufferData } = await this.httpService.axiosRef.get(
        userData.picture,
        {
          responseType: 'arraybuffer',
        },
      );
      user = await this.prisma.user.create({
        data: {
          email: userData.email,
          username: userData.nickname,
          authProvider: $Enums.AuthProvider.Kakao,
          userProfile: {
            create: {
              filename: 'KakaoProfile-' + userData.nickname,
              image: bufferData,
              mimetype: 'image/jpg',
            },
          },
          socialUser: {
            create: {
              provider: data.id_token,
            },
          },
        },
        include: {
          userProfile: true,
          socialUser: true,
        },
      });
    } else {
      this.logger.info('이미 카카오 회원가입 완료');
    }
    return user;
  }

  async initializeUserPassword(email: string) {
    const hashedPassword = this.encryptManager.getRandomHashedPassword();

    await this.prisma.user.update({
      where: { email, deletedAt: null },
      data: { localUser: { update: { password: hashedPassword } } },
    });
    return hashedPassword;
  }

  async signUpSocial(decodedToken: jwt.JwtPayload) {
    const { headers, data } = await this.httpService.axiosRef.get(
      decodedToken.picture,
      { responseType: 'arraybuffer' },
    );
    const mimetype = (headers['Content-Type'] || 'image/jpg') as string;
    this.logger.info(data);
    await this.prisma.user.create({
      data: {
        email: decodedToken.email,
        username: decodedToken.nickname,
        authProvider: $Enums.AuthProvider.Kakao,
        socialUser: {
          create: {
            provider: decodedToken.aud as string,
          },
        },
        userProfile: {
          create: {
            filename: decodedToken.nickname + '-' + 'profileImage',
            image: Buffer.from(data),
            mimetype,
          },
        },
      },
      include: {
        socialUser: true,
        userProfile: true,
      },
    });
  }

  async lastLogin(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { lastLogin: new Date() },
    });
  }

  async sendInitializeConfirmMail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email, deletedAt: null },
    });

    if (!user) {
      const errorCode = await this.prisma.getErrorCode('user', 'NotFound');
      throw new NotFoundException(errorCode);
    }

    const token = this.encryptManager.encryptData(email);
    const defaultEmail = this.configService.get('email.defaultEmail');
    const domain = this.configService.get('common.currentDomain');
    const message = {
      to: `${email}`,
      subject: 'SnapPoll 계정 비밀번호 초기화 안내',
      text: 'SnapPoll에서 발송한 메세지 입니다.',
      context: {
        title: 'SnapPoll 계정 비밀번호 초기화',
        content:
          '계정 비밀번호 초기화 후 발급된 비밀번호로 로그인하여 프로필 > 비밀번호 변경으로 이동하여 새로운 비밀번호로 변경하시기 바랍니다. 본인에 의한 확인 메일이 아니라면 아래 메일로 문의해주세요.',
        action: domain + '/api/auth/init/confirm',
        token,
        email: defaultEmail,
        image: 'https://snappoll.kro.kr/images/original.png',
      },
      templatePath: path.join(
        path.resolve(),
        'src',
        'mailer',
        'template',
        'confirmPage.hbs',
      ),
    };

    const result = await this.mailer.sendConfirmMail(message);

    this.logger.debug(result);
    this.logger.debug(`send email to ${email}`);

    return token;
  }

  async getKakaoLoginToken(code: string) {
    try {
      const kakaoKey = this.configService.get('common.kakaoKey');
      const config = {
        grant_type: 'authorization_code',
        client_id: kakaoKey,
        redirect_uri: `${CURRENT_DOMAIN}/api/auth/login/kakao`,
        code,
      };
      const params = new URLSearchParams(config).toString();
      const tokenHeader = {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      };
      const { data } = await firstValueFrom(
        this.httpService.post(
          `https://kauth.kakao.com/oauth/token?${params}`,
          '',
          {
            headers: tokenHeader,
          },
        ),
      );
      // this.logger.debug(data);
      const userData = jwt.decode(data.id_token) as jwt.JwtPayload;
      // this.logger.debug('user:', userData);
      return { data, userData };
    } catch (error) {
      this.logger.debug(error);
      const errorCode = await this.prisma.getErrorCode('user', 'BadRequest');
      throw new BadRequestException(errorCode);
    }
  }

  async validateUser(email: string, userPassword: string) {
    const user = await this.prisma.user.findUnique({
      where: { email, deletedAt: null },
      include: {
        localUser: true,
        socialUser: true,
        userProfile: {
          select: {
            id: true,
          },
        },
        subscription: {
          include: {
            plan: true,
          },
        },
      },
    });

    if (!user) {
      this.logger.debug('없는 사용자');
      const errorCode = await this.prisma.getErrorCode('user', 'NotFound');
      throw new NotFoundException(errorCode);
    }

    if (user.isActive === false) {
      this.logger.info('활동정지된 회원');
      const errorCode = await this.prisma.getErrorCode('user', 'Deactivated');
      throw new BadRequestException(errorCode);
    }

    if (user.deletedAt !== null) {
      this.logger.debug('탈퇴 회원');
      const errorCode = await this.prisma.getErrorCode('user', 'RemovedUser');
      throw new BadRequestException(errorCode);
    }

    if (user.localUser) {
      const encryptedPassword = this.encryptManager.encryptData(userPassword);
      if (user.localUser.password !== encryptedPassword) {
        const errorCode = await this.prisma.getErrorCode(
          'auth',
          'CheckUserData',
        );
        throw new BadRequestException(errorCode);
      }
    }

    const { socialUser, localUser, ...users } = user;
    return users;
  }

  async checkEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (user) {
      const errorCode = await this.prisma.getErrorCode(
        'user',
        'AlreadyUsedEmail',
      );
      throw new ConflictException(errorCode);
    }

    this.logger.debug('to:', email);

    const token = this.encryptManager.encryptData(email);
    const defaultEmail = this.configService.get('email.defaultEmail');
    const domain = this.configService.get('common.currentDomain');
    const message = {
      to: `${email}`,
      subject: 'SnapPoll 이메일 확인 요청',
      text: '확인해주세요.',
      context: {
        title: '이메일 본인인증',
        content:
          '본인인증을 위한 메일입니다. 본인에 의한 확인 메일이 아닌 경우, 아래 메일로 문의해주세요.',
        action: domain + '/api/auth/validate',
        domain,
        token,
        email: defaultEmail,
        image: 'https://snappoll.kro.kr/images/original.png',
      },
      templatePath: path.join(
        path.resolve(),
        'src',
        'mailer',
        'template',
        'confirmPage.hbs',
      ),
    };

    const result = await this.mailer.sendConfirmMail(message);

    this.logger.debug(result);

    this.logger.debug(`send email to ${email}`);

    return token;
  }

  getExpiredLeftTime(expiredTime: number = 0) {
    if (!expiredTime) return 0;
    const now = Math.floor(Date.now() / 1000);
    const leftExpiredTime = expiredTime - now;
    return leftExpiredTime;
  }

  getMe(email: string) {
    return this.prisma.user.findUnique({
      where: { email, deletedAt: null },
      include: {
        userProfile: {
          select: {
            id: true,
          },
        },
        subscription: {
          include: {
            plan: true,
          },
        },
      },
    });
  }

  async requestLoginKakao() {
    const { data } = await firstValueFrom(
      this.httpService.get(
        `https://kauth.kakao.com/oauth/authorize?client_id=7043de6fabb4db468e0530f5cdd0e209&redirect_uri=${encodeURIComponent('http://localhost:8080/api/auth/login/kakao')}`,
      ),
    );
    // this.logger.debug(data);
    return data;
  }
}
