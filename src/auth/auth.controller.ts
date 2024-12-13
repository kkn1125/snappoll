import { CLIENT_DOMAIN, CURRENT_DOMAIN } from '@common/variables';
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
import Logger from '@utils/Logger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { BatchService } from './batch.service';
import { IgnoreCookie } from './ignore-cookie.decorator';

@Controller('auth')
export class AuthController {
  logger = new Logger(this);

  constructor(
    private readonly authService: AuthService,
    private readonly batchService: BatchService,
    private readonly configService: ConfigService,
  ) {}

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

  @Post('init/confirm')
  async confirmInitializeUserPasswordFromEmail(
    @Body() data: any,
    @Res() res: Response,
  ) {
    const mapper = this.batchService.mapper.get(data.token);

    if (!mapper) {
      res.send(`
        ${this.authService.style}
        <div class="wrap">
          <h3>초기화 확인 시간이 만료되었습니다. 다시 시도해주세요. -100</h3>
          <button onclick="window.close()">닫기</button>
        </div>
      `);
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

      res.send(`
          ${this.authService.style}
          <div class="wrap">
            <h3>초기화 확인 시간이 만료되었습니다. 다시 시도해주세요. -101</h3>
            <button onclick="window.close()">닫기</button>
          </div>
        `);
      return;
    }

    if (has && matched) {
      resolve(data);

      const hashedPassword =
        await this.authService.initializeUserPassword(email);

      res.send(`
          ${this.authService.style}
          <div class="wrap">
            <h3>${email}님의 계정이 확인되었습니다.</h3>
            <h5>페이지로 돌아가 남은 과정을 진행해주세요.</h5>
            <h5>발급된 비밀번호는 <strong>${hashedPassword}</strong> 입니다.</h5>
            <button onclick="window.close()">닫기</button>
          </div>
        `);
    } else {
      resolve(false);
      res.send(`
          ${this.authService.style}
          <div class="wrap">
            <h3>초기화 확인 시간이 만료되었습니다. 다시 시도해주세요. -102</h3>
            <button onclick="window.close()">닫기</button>
          </div>
        `);
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
  validateEmail(@Body() data: any, @Res() res: Response) {
    const mapper = this.batchService.mapper.get(data.token);

    if (!mapper) {
      res.send(`
        ${this.authService.style}
        <div class="wrap">
          <h3>존재하지 않는 토큰입니다.</h3>
          <button onclick="window.close()">닫기</button>
        </div>
      `);
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

      res.send(`
          ${this.authService.style}
          <div class="wrap">
            <h3>토큰 유효기간이 만료되었습니다.</h3>
            <button onclick="window.close()">닫기</button>
          </div>
        `);
      return;
    }

    if (has && matched) {
      resolve(data);
      res.send(`
          ${this.authService.style}
          <div class="wrap">
            <h3>${email}님의 계정이 확인되었습니다.</h3>
            <h5>페이지로 돌아가 남은 과정을 진행해주세요.</h5>
            <button onclick="window.close()">닫기</button>
          </div>
        `);
    } else {
      resolve(false);
      res.send(`
          ${this.authService.style}
          <div class="wrap">
            <h3>잘못된 토큰 형식입니다.</h3>
            <button onclick="window.close()">닫기</button>
          </div>
        `);
    }
  }

  @IgnoreCookie()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req: Request, @Res() res: Response) {
    const user = req.user;
    const { token, refreshToken } = this.authService.getToken({
      id: user.id,
      username: user.username,
      email: user.email,
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

    res.json({
      ok: true,
    });
  }

  @IgnoreCookie()
  @Get('request/kakao')
  @Header('Content-Type', 'text/html')
  async requestAsKakao(@Res() res: Response) {
    // const data = await this.authService.requestLoginKakao();
    const kakaoKey = this.configService.get('common.KAKAO_KEY');
    res.redirect(
      `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoKey}&redirect_uri=${encodeURIComponent(`${CURRENT_DOMAIN}/api/auth/login/kakao`)}&response_type=code`,
    );
  }

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

  @Post('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    if (req.user) {
      res.clearCookie('token', {
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

      res.json({
        ok: true,
      });
    } else {
      throw new UnauthorizedException('잘못된 접근입니다.');
    }
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('verify')
  async verify(@Req() req: Request, @Res() res: Response) {
    if (!req.verify) {
      throw new UnauthorizedException('토큰이 만료되었습니다.');
    }
    res.json();
  }
}
