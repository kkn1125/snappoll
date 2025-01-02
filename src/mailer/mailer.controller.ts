import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { IgnoreCookie } from '@auth/ignore-cookie.decorator';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';

@Controller('mailer')
export class MailerController {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  @IgnoreCookie()
  @Get('test')
  async sendTestMail() {
    await this.mailerService.sendTestMail();
    return {
      ok: true,
    };
  }

  @IgnoreCookie()
  @Get('view')
  async viewTestMail(@Res() res: Response) {
    const defaultEmail = this.configService.get('email.defaultEmail');
    const context = {
      title: '이메일 본인인증',
      content:
        '본인인증을 위한 메일입니다. 본인에 의한 확인 메일이 아닌 경우, 아래 메일로 문의해주세요.',
      email: defaultEmail,
      image: 'https://snappoll.kro.kr/images/original.png',
    };
    const templatePath = path.join(
      path.resolve(),
      'src',
      'mailer',
      'template',
      'notice.hbs',
    );
    const template = await this.mailerService.generateHTML({
      context,
      templatePath,
      email: defaultEmail,
    });
    res.send(template);
  }

  @Post('all/:type/:id')
  async sendMailToAll(@Param('type') type: string, @Param('id') id: string) {
    // return this.mailerService.sendManualMail(type, id);
  }

  @Post('specific/:type/:id')
  async sendMailToSpecific(
    @Param('type') type: string,
    @Param('id') id: string,
    @Body() specificUsers: string[],
  ) {
    // return this.mailerService.sendManualMail(type, id);
  }
}
