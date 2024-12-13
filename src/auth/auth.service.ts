import { MailerService } from '@/mailer/mailer.service';
import { CURRENT_DOMAIN } from '@common/variables';
import { PrismaService } from '@database/prisma.service';
import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Logger from '@utils/Logger';
import * as jwt from 'jsonwebtoken';
import Mail from 'nodemailer/lib/mailer';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  logger = new Logger(this);
  style = `
    <style>
      html, body {
        margin: 0;
        height: 100%;
        overflow: hidden;
      }
      .header {
        font-size: 1.5rem;
        margin-bottom: 1em;
      }
      button {
        border-radius: 0.3rem;
        border-width: 1px;
        border-color: #5193cf;
        border-style: solid;
        transition: all 150ms ease-in-out;
        box-sizing: border-box;
        background: transparent;
        padding: 0.3rem 0.8rem;
        font-weight: 700;
        font-size: 1rem;
        &:hover {
          cursor: pointer;
          border-color: #ffffff00;
          background: #5193cf;
          color: white;
        }
      }
      .wrap {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        justify-content: center;
        align-items: center;
        height: 100%;
      }
    </style>`;

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
      throw new BadRequestException('계정을 찾을 수 없습니다.');
    }

    this.logger.debug('to:', email);

    const address = this.configService.get('email.ADDRESS');
    const mode = this.configService.get('common.MODE');

    const clientDomain =
      mode === 'development'
        ? 'http://localhost:5000'
        : 'https://snappoll.kro.kr';
    const domain =
      mode === 'development'
        ? 'http://localhost:8080'
        : 'https://snappoll.kro.kr';

    this.logger.debug('admin email', address);

    const token = this.prisma.encryptPassword(email);

    const message = {
      from: `SnapPollHelper <${address}>`,
      to: `${email}`,
      subject: 'SnapPoll 계정 비밀번호 초기화 안내',
      text: '확인해주세요.',
      html: `<div>
        <img src="${clientDomain}/logo/original.png" alt="snappoll-logo" width="50" height="50" />
        <h2>SnapPoll 계정 비밀번호 초기화</h2>
        <p>계정 비밀번호 초기화 후 로그인하여 프로필 > 비밀번호 변경으로 이동하여 자신의 비밀번호로 변경해주시기 바랍니다. 본인에 의한 확인 메일이 아닌 경우, 아래 메일로 문의해주세요.</p>

        <form method="post" action="${domain}/api/auth/init/confirm">
          <input type="hidden" name="token" value="${token}" />
          <input type="hidden" name="domain" value="snappollhelper" />
          <button type="submit">확인</button>
        </form>
        
        <a href="mailto:devkimsonhelper@gmail.com">devkimsonhelper@gmail.com</a>
      </div>`,
    } as Mail.Options;

    const result = await this.mailer.sendConfirmMail(message);

    this.logger.debug(result);

    this.logger.debug(`send email to ${email}`);

    return token;
  }

  async getKakaoLoginToken(code: string) {
    try {
      const kakaoKey = this.configService.get('common.KAKAO_KEY');
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
      throw new BadRequestException('잘못된 요청입니다.');
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

    if (!user) return null;
    if (user.deletedAt !== null) {
      throw new BadRequestException('탈퇴된 계정입니다.');
    }

    const encryptedPassword = this.prisma.encryptPassword(userPassword);

    if (user.localUser.password !== encryptedPassword) return null;

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

    const address = this.configService.get('email.ADDRESS');
    const mode = this.configService.get('common.MODE');

    const clientDomain =
      mode === 'development'
        ? 'http://localhost:5000'
        : 'https://snappoll.kro.kr';
    const domain =
      mode === 'development'
        ? 'http://localhost:8080'
        : 'https://snappoll.kro.kr';

    this.logger.debug('admin email', address);

    const token = this.prisma.encryptPassword(email);

    const message = {
      from: `SnapPollHelper <${address}>`,
      to: `${email}`,
      subject: 'SnapPoll 이메일 확인 요청',
      text: '확인해주세요.',
      html: `<div>
        <img src="${clientDomain}/logo/original.png" alt="snappoll-logo" width="50" height="50" />
        <h2>이메일 본인인증</h2>
        <p>본인인증을 위한 메일입니다. 본인에 의한 확인 메일이 아닌 경우, 아래 메일로 문의해주세요.</p>

        <form method="post" action="${domain}/api/auth/validate">
          <input type="hidden" name="token" value="${token}" />
          <input type="hidden" name="domain" value="snappollhelper" />
          <button type="submit">확인</button>
        </form>
        
        <a href="mailto:devkimsonhelper@gmail.com">devkimsonhelper@gmail.com</a>
      </div>`,
    } as Mail.Options;
    this.logger.debug(this.mailer);
    const result = await this.mailer.sendConfirmMail(message);

    this.logger.debug(result);

    this.logger.debug(`send email to ${email}`);

    return token;
  }

  getToken(userData: { id: string; email: string; username: string }) {
    const secretKey = this.configService.get<string>('common.SECRET_KEY');
    const token = jwt.sign(
      {
        ...userData,
        loginAt: Date.now(),
      },
      secretKey,
      {
        expiresIn: '30m',
        issuer: 'snapPoll',
        algorithm: 'HS256',
      },
    );
    const refreshToken = jwt.sign(
      {
        ...userData,
        loginAt: Date.now(),
      },
      secretKey,
      {
        subject: 'refresh',
        expiresIn: '1h',
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
        // poll: true,
        localUser: true,
        socialUser: true,
        userProfile: true,
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
