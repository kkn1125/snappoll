import { MailerService } from '@/mailer/mailer.service';
import { CURRENT_DOMAIN, EXPIRED_TOKEN_TIME } from '@common/variables';
import { PrismaService } from '@database/prisma.service';
import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import SnapLogger from '@utils/SnapLogger';
import * as jwt from 'jsonwebtoken';
import ms from 'ms';
import * as path from 'path';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  logger = new SnapLogger(this);

  constructor(
    private readonly mailer: MailerService,
    public readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async initializeUserPassword(email: string) {
    const special = [
      '!',
      '@',
      '#',
      '$',
      '%',
      '^',
      '&',
      '*',
      '.',
      '/',
      '?',
      '\\',
      '-',
      '+',
    ];

    const randomSpecial = special[Math.floor(Math.random() * special.length)];
    const random = Math.floor(Math.random() * (90 - 65 + 1)) + 65;
    const alphabet = String.fromCharCode(random);

    const hex = this.prisma.randomHex();

    const hashedPassword = hex.slice(0, 10) + alphabet + randomSpecial;
    const password = this.prisma.encryptPassword(hashedPassword);
    await this.prisma.user.update({
      where: { email },
      data: { localUser: { update: { password } } },
    });
    return hashedPassword;
  }

  async sendInitializeConfirmMail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      const errorCode = await this.prisma.getErrorCode('user', 'NotFound');
      throw new NotFoundException(errorCode);
    }

    const token = this.prisma.encryptPassword(email);
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
      this.logger.debug(data);
      const userData = jwt.decode(data.id_token);
      this.logger.debug('user:', userData);
      return data;
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
        userProfile: true,
      },
    });

    if (!user) {
      this.logger.debug('없는 사용자');
      const errorCode = await this.prisma.getErrorCode('user', 'NotFound');
      throw new NotFoundException(errorCode);
    }

    if (user.deletedAt !== null) {
      this.logger.debug('탈퇴 회원');
      const errorCode = await this.prisma.getErrorCode('user', 'RemovedUser');
      throw new BadRequestException(errorCode);
    }

    const encryptedPassword = this.prisma.encryptPassword(userPassword);

    if (user.localUser.password !== encryptedPassword) {
      const errorCode = await this.prisma.getErrorCode('auth', 'CheckUserData');
      throw new BadRequestException(errorCode);
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

    const token = this.prisma.encryptPassword(email);
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

  getToken(userData: UserTokenData) {
    const secretKey = this.configService.get<string>('common.secretKey');
    const TOKEN_EXPIRED_AT = ms(EXPIRED_TOKEN_TIME);
    const REFRESH_TOKEN_EXPIRED_AT = ms(EXPIRED_TOKEN_TIME * 2);
    this.logger.info('만료시간 체크:', TOKEN_EXPIRED_AT);
    const token = jwt.sign(userData, secretKey, {
      expiresIn: TOKEN_EXPIRED_AT,
      issuer: 'snapPoll',
      algorithm: 'HS256',
    });
    const refreshToken = jwt.sign(
      {
        ...userData,
        loginAt: Date.now(),
      },
      secretKey,
      {
        subject: 'refresh',
        expiresIn: REFRESH_TOKEN_EXPIRED_AT,
        issuer: 'snapPoll',
        algorithm: 'HS256',
      },
    );
    return { token, refreshToken };
  }

  getMe(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        userProfile: {
          select: {
            id: true,
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
    this.logger.debug(data);
    return data;
  }
}
