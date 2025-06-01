import { MailerService } from '@/mailer/mailer.service';
import { IgnoreCookie } from '@auth/ignore-cookie.decorator';
import { Controller, Get, Param, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import * as path from 'path';
import { BasicService } from './basic.service';

@ApiTags('기본')
@Controller()
export class BasicController {
  constructor(
    private readonly configService: ConfigService,
    private readonly basicService: BasicService,
    private readonly mailerService: MailerService,
  ) {}

  @IgnoreCookie()
  @Get('/sitemap.xml')
  async sitemap(@Res() res: Response) {
    res.setHeader('Content-Type', 'application/xml');
    res.send(await this.basicService.sitemap());
  }

  @IgnoreCookie()
  @Get('version')
  checkVersion() {
    const version = this.configService.get<string>('common.version');
    return {
      ok: true,
      version,
    };
  }

  @IgnoreCookie()
  @Get('upload/:filename')
  getImageFile(@Param('filename') filename: string, @Res() res: Response) {
    res.sendFile(path.join(path.resolve(), 'upload', filename));
  }

  @IgnoreCookie()
  @Get('preview/:filename')
  async previewHBS(@Res() res: Response, @Param('filename') filename: string) {
    let context: Record<string, unknown> = {};

    switch (filename) {
      case 'emailCheck':
        context = {
          title: 'SnapPoll 계정 비밀번호 초기화',
          content:
            '계정 비밀번호 초기화 후 발급된 비밀번호로 로그인하여 프로필 > 비밀번호 변경으로 이동하여 새로운 비밀번호로 변경하시기 바랍니다. 본인에 의한 확인 메일이 아니라면 아래 메일로 문의해주세요.',
          action: '/test',
          token: 'test',
          email: 'devkimsonhelper@gmail.com',
          image: 'https://snappoll.kro.kr/images/original.png',
        };
        break;
      case 'initializeAccountPassword':
        context = {
          title: '이메일 본인인증',
          content:
            '본인인증을 위한 메일입니다. 본인에 의한 확인 메일이 아닌 경우, 아래 메일로 문의해주세요.',
          action: '/test',
          token: 'test',
          email: 'devkimsonhelper@gmail.com',
          image: 'https://snappoll.kro.kr/images/original.png',
        };
        break;
      default:
        break;
    }

    await this.mailerService.renderTemplatePage(res, filename, context);
  }

  // @Header('Content-Type', 'text/css')
  // @HttpCode(HttpStatus.OK)
  // @IgnoreCookie()
  // @Get('style/:filename')
  // async getStyle(@Res() res: Response, @Param('filename') filename: string) {
  //   res.sendFile(path.join(path.resolve(), 'src', 'mailer', 'style', filename));
  // }
}
