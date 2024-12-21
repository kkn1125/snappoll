import { MailerService } from '@/mailer/mailer.service';
import {
  CLIENT_DOMAIN,
  CURRENT_DOMAIN,
  EXPIRED_TOKEN_TIME,
} from '@common/variables';
import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import SnapLogger from '@utils/SnapLogger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { BatchService } from './batch.service';
import { IgnoreCookie } from './ignore-cookie.decorator';

@Controller('auth')
export class AuthController {
  logger = new SnapLogger(this);

  constructor(
    private readonly authService: AuthService,
    private readonly batchService: BatchService,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  @IgnoreCookie()
  @Post('init')
  async initializeUserPasswordFromEmail(
    @Body() data: { email: string },
    @Res() res: Response,
  ) {
    const mapper = this.batchService.mapper;
    const token = await this.authService.sendInitializeConfirmMail(data.email);

    const response = await new Promise<{ token: string } | boolean>(
      (resolve) => {
        mapper.set(token, { start: Date.now(), email: data.email, resolve });
      },
    );

    if (response && response instanceof Object && 'token' in response) {
      this.batchService.mapper.delete(response.token);
    }

    res.json({
      ok: !!response,
    });
  }

  @IgnoreCookie()
  @Post('init/confirm')
  async confirmInitializeUserPasswordFromEmail(
    @Body() data: any,
    @Res() res: Response,
  ) {
    const image = 'https://snappoll.kro.kr/images/original.png';
    const defaultEmail = this.configService.get('email.defaultEmail');
    const mapper = this.batchService.mapper.get(data.token);

    if (!mapper) {
      await this.mailerService.renderTemplatePage(res, 'alertPage', {
        image,
        title: '잘못된 요청',
        email: defaultEmail,
        content: '권한이 없는 요청입니다.',
      });
      return;
    }

    const { resolve, email, start, expired } = mapper;
    const gap = Date.now() - start;
    const expiresAt = gap > this.batchService.cacheTime;
    const compareToken = this.authService.prisma.encryptPassword(email);
    const matched = compareToken === data.token;
    const has = !!resolve;

    if (expired || expiresAt) {
      this.batchService.mapper.delete(data.token);

      await this.mailerService.renderTemplatePage(res, 'alertPage', {
        image,
        title: '초기화 확인 시간 만료',
        email: defaultEmail,
        content: '초기화 확인 시간이 만료되었습니다. 다시 시도해주세요.',
      });
      return;
    }

    if (has && matched) {
      resolve(data);

      const hashedPassword =
        await this.authService.initializeUserPassword(email);
      await this.mailerService.renderTemplatePage(res, 'alertPage', {
        image,
        title: '본인 확인 완료',
        email: defaultEmail,
        content: `${email}님의 계정이 확인되었습니다. 페이지로 돌아가 남은 과정을
        진행해주세요. 발급된 비밀번호는
        <strong style="font-weight: 700;">${hashedPassword}</strong>
        입니다.<br/>발급된 비밀번호는 다시 확인 하실 수 없기 때문에 별도로 메모해두시기 바랍니다.`,
      });
    } else {
      resolve(false);
      await this.mailerService.renderTemplatePage(res, 'alertPage', {
        image,
        title: '잘못된 요청',
        email: defaultEmail,
        content: '권한이 없는 요청입니다.',
      });
    }
  }

  @IgnoreCookie()
  @Get('check/email/:email')
  async checkEmail(@Res() res: Response, @Param('email') email: string) {
    this.logger.debug(email);
    const token = await this.authService.checkEmail(email);

    const data = await new Promise<{ token: string } | boolean>((resolve) =>
      this.batchService.mapper.set(token, {
        resolve,
        start: Date.now(),
        email,
      }),
    );

    if (data && data instanceof Object && 'token' in data) {
      this.batchService.mapper.delete(data.token);
    }

    res.json({
      ok: !!data,
    });
  }

  @IgnoreCookie()
  @Post('validate')
  async validateEmail(@Body() data: any, @Res() res: Response) {
    const mapper = this.batchService.mapper.get(data.token);
    const image = 'https://snappoll.kro.kr/images/original.png';
    const defaultEmail = this.configService.get('email.defaultEmail');

    if (!mapper) {
      await this.mailerService.renderTemplatePage(res, 'alertPage', {
        image,
        title: '토큰 에러',
        content: '존재하지 않는 토큰입니다.',
        email: defaultEmail,
      });
      return;
    }

    const { resolve, email, start, expired } = mapper;

    const gap = Date.now() - start;
    const expiresAt = gap > this.batchService.cacheTime;

    const compareToken = this.authService.prisma.encryptPassword(email);
    // console.log(compareToken, data.token, email);
    const matched = compareToken === data.token;
    const has = !!resolve;

    if (expired || expiresAt) {
      this.batchService.mapper.delete(data.token);

      await this.mailerService.renderTemplatePage(res, 'alertPage', {
        image,
        title: '토큰 에러',
        content: '토큰 유효기간이 만료되었습니다.',
        email: defaultEmail,
      });
      return;
    }

    if (has && matched) {
      resolve(data);
      await this.mailerService.renderTemplatePage(res, 'alertPage', {
        image,
        title: '본인 확인 완료',
        content: `${email}님의 계정이 확인되었습니다. 페이지로 돌아가 남은 과정을 진행해주세요.`,
        email: defaultEmail,
      });
    } else {
      resolve(false);
      await this.mailerService.renderTemplatePage(res, 'alertPage', {
        image,
        title: '토큰 에러',
        content: '잘못된 토큰 형식입니다.',
        email: defaultEmail,
      });
    }
  }

  @IgnoreCookie()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user;
    const { token, refreshToken } = this.authService.getToken({
      id: user.id,
      username: user.username,
      email: user.email,
      authProvider: user.authProvider,
      loginAt: Date.now(),
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
    });
    res.cookie('refresh', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
    });

    const expiredTime = Math.floor(EXPIRED_TOKEN_TIME / 1000);
    this.logger.info('만료기간?', expiredTime);
    return {
      user: req.user,
      expiredTime,
    };
  }

  @IgnoreCookie()
  @Get('request/kakao')
  @Header('Content-Type', 'text/html')
  async requestAsKakao(@Res() res: Response) {
    // const data = await this.authService.requestLoginKakao();
    const kakaoKey = this.configService.get('common.kakaoKey');
    res.redirect(
      `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoKey}&redirect_uri=${encodeURIComponent(`${CURRENT_DOMAIN}/api/auth/login/kakao`)}&response_type=code`,
    );
  }

  @IgnoreCookie()
  @Get('login/kakao')
  async loginAsKakao(@Query('code') code: string, @Res() res: Response) {
    const data = await this.authService.getKakaoLoginToken(code);
    const params = {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      id_token: data.id_token,
    };

    res.cookie('token', data.id_token);
    res.redirect(`${CLIENT_DOMAIN}/user/choice?${new URLSearchParams(params)}`);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    if (req.user) {
      res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
      });
      res.clearCookie('admin-token', {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
      });
      res.clearCookie('refresh', {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
      });
    } else {
      const errorCode = await this.authService.prisma.getErrorCode(
        'auth',
        'BadRequest',
      );
      throw new UnauthorizedException(errorCode);
    }
    res.json();
  }

  // @HttpCode(HttpStatus.NO_CONTENT)
  @Post('verify')
  async verify(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body('admin') admin: boolean,
  ) {
    if (!req.verify) {
      const errorCode = await this.authService.prisma.getErrorCode(
        'auth',
        'ExpiredToken',
      );
      throw new UnauthorizedException(errorCode);
    }
    const leftTime = this.authService.getExpiredLeftTime(req.verify.exp);

    this.logger.info('토큰 만료 기간:', leftTime);
    return {
      leftTime,
    };
  }

  @Post('refresh')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { id, email, username, authProvider, loginAt } = req.verify;

    const { token, refreshToken } = this.authService.getToken({
      id,
      email,
      username,
      authProvider,
      loginAt,
      refreshAt: Date.now(),
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
    });
    res.cookie('refresh', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
    });

    const expiredTime = Math.floor(EXPIRED_TOKEN_TIME / 1000);
    this.logger.info('리프레시 만료 기간:', expiredTime);

    return {
      leftTime: expiredTime,
    };
  }
}
