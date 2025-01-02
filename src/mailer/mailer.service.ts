import { BatchService } from '@auth/batch.service';
import { BRAND_NAME } from '@common/variables';
import { PrismaService } from '@database/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { $Enums } from '@prisma/client';
import { EncryptManager } from '@utils/EncryptManager';
import { Response } from 'express';
import fs from 'fs/promises';
import Handlebars from 'handlebars';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import * as path from 'path';

@Injectable()
export class MailerService {
  from: string = 'devkimsonhelper@gmail.com';

  transporter: nodemailer.Transporter<
    SMTPTransport.SentMessageInfo,
    SMTPTransport.Options
  >;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly batchService: BatchService,
    private readonly encryptManager: EncryptManager,
  ) {
    const emailAddress = this.configService.get('email.address');
    const emailPassword = this.configService.get('email.password');
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.google.com',
      port: 587,
      ignoreTLS: true,
      secure: false, // true for port 465, false for other ports
      requireTLS: false,
      auth: {
        user: emailAddress,
        pass: emailPassword,
      },
    });
  }

  async sendTestMail() {
    const message = {
      to: `chaplet01@gmail.com`,
      subject: 'SnapPoll',
      text: '보안메일입니다.',
    };
    const defaultName = this.configService.get('email.defaultName');
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
    const template = await this.generateHTML({
      context,
      templatePath,
      email: defaultEmail,
    });

    return this.transporter.sendMail({
      ...message,
      from: `"${defaultName}" <${defaultEmail}>`,
      html: template,
    });
  }

  // async createHtml(token: string, filename: string, context: any) {
  //   const layout = await fs.readFile(
  //     path.join(path.resolve(), 'src', 'mailer', 'template', 'layout.hbs'),
  //     { encoding: 'utf-8' },
  //   );
  //   const headerTemplate = await fs.readFile(
  //     path.join(path.resolve(), 'src', 'mailer', 'template', 'header.hbs'),
  //     { encoding: 'utf-8' },
  //   );
  //   const footerTemplate = await fs.readFile(
  //     path.join(path.resolve(), 'src', 'mailer', 'template', 'header.hbs'),
  //     { encoding: 'utf-8' },
  //   );
  //   const template = await fs.readFile(
  //     path.join(path.resolve(), 'src', 'mailer', 'template', filename + '.hbs'),
  //     { encoding: 'utf-8' },
  //   );
  //   const header = Handlebars.compile(headerTemplate, { strict: true })(
  //     context,
  //   );
  //   const footer = Handlebars.compile(footerTemplate, { strict: true })(
  //     context,
  //   );
  //   const html = Handlebars.compile(template, { strict: true })(context);

  //   const layoutTemplate = Handlebars.compile(layout, { strict: true })({
  //     title: context.title,
  //     header,
  //     replace: html,
  //     footer,
  //   });

  //   const data = this.batchService.mapper.get(token);
  //   if (data) {
  //     data.resolve({ token });
  //   }

  //   return layoutTemplate;
  // }

  async getAdminToken(defaultEmail: string) {
    const admin = await this.prisma.user.findUnique({
      where: { email: defaultEmail, role: $Enums.Role.Admin },
    });
    if (!admin) {
      const errorCode = await this.prisma.getErrorCode('mailer', 'NotFound');
      throw new NotFoundException(errorCode);
    }

    const { token } = this.encryptManager.getToken({
      id: admin.id,
      email: admin.email,
      username: admin.username,
      authProvider: admin.authProvider,
      loginAt: Date.now(),
    });
    return token;
  }

  async generateHTML({
    templatePath,
    context,
    html,
    email,
  }: Mail.Options & {
    templatePath: string;
    context: Record<string, unknown>;
    email: string;
  }) {
    let htmlText: string | Buffer | Mail.Options['html'] | undefined;

    const layout = await fs.readFile(
      path.join(path.resolve(), 'src', 'mailer', 'template', 'layout.hbs'),
      { encoding: 'utf-8' },
    );
    const headerTemplate = await fs.readFile(
      path.join(path.resolve(), 'src', 'mailer', 'template', 'header.hbs'),
      {
        encoding: 'utf-8',
      },
    );
    const footerTemplate = await fs.readFile(
      path.join(path.resolve(), 'src', 'mailer', 'template', 'footer.hbs'),
      {
        encoding: 'utf-8',
      },
    );
    const header = Handlebars.compile(headerTemplate, { strict: true })(
      context,
    );
    const footer = Handlebars.compile(footerTemplate, { strict: true })(
      context,
    );

    if (templatePath) {
      const template = await fs.readFile(templatePath, { encoding: 'utf-8' });
      htmlText = Handlebars.compile(template, { strict: true })(context);
    }
    htmlText = html ? html : htmlText;
    const layoutTemplate = Handlebars.compile(layout, { strict: true })({
      title: context.title,
      header,
      footer,
      replace: htmlText,
      email,
    });
    return layoutTemplate;
  }

  async sendConfirmMail({
    templatePath,
    context,
    from,
    ...mailOptions
  }: Mail.Options & {
    templatePath: string;
    context: Record<string, unknown>;
  }) {
    const defaultName = this.configService.get('email.defaultName');
    const defaultEmail = this.configService.get('email.defaultEmail');
    const fromText = from ? from : `"${defaultName}" <${defaultEmail}>`;
    const layoutTemplate = await this.generateHTML({
      templatePath,
      context,
      html: mailOptions.html,
      email: defaultEmail,
    });
    return this.transporter.sendMail({
      ...mailOptions,
      from: fromText,
      html: layoutTemplate,
    });
  }

  async renderTemplatePage(
    res: Response,
    filename: string,
    context: Record<string, unknown>,
  ) {
    const defaultEmail = this.configService.get('email.defaultEmail');
    const layout = await fs.readFile(
      path.join(path.resolve(), 'src', 'mailer', 'template', 'layout.hbs'),
      { encoding: 'utf-8' },
    );
    const headerTemplate = await fs.readFile(
      path.join(path.resolve(), 'src', 'mailer', 'template', 'header.hbs'),
      {
        encoding: 'utf-8',
      },
    );
    const footerTemplate = await fs.readFile(
      path.join(path.resolve(), 'src', 'mailer', 'template', 'footer.hbs'),
      {
        encoding: 'utf-8',
      },
    );
    const header = Handlebars.compile(headerTemplate, { strict: true })(
      context,
    );
    const footer = Handlebars.compile(footerTemplate, { strict: true })(
      context,
    );

    const template = await fs.readFile(
      path.join(path.resolve(), 'src', 'mailer', 'template', filename + '.hbs'),
      { encoding: 'utf-8' },
    );
    const content = Handlebars.compile(template, {
      strict: true,
      noEscape: true,
    })(context);

    res.send(
      Handlebars.compile(layout, {
        strict: true,
      })({
        title: context.title,
        header,
        footer,
        replace: content,
        email: defaultEmail,
      }),
    );
  }

  async sendAdminConfirmationEmail() {
    const domain = this.configService.get('common.currentDomain');
    const defaultEmail = this.configService.get('email.defaultEmail');
    const domainToken = 'snappollhelper';
    const token = this.encryptManager.encryptData(
      defaultEmail + '|' + domainToken,
    );
    const message = {
      to: defaultEmail,
      subject: '⚠️ SnapPoll 관리자 이메일 확인 요청',
      text: '보안 등급이 높습니다. 관리자 페이지 접근 요청입니다. 꼭 확인해주세요.',
      context: {
        title: '관리자 인증 요청',
        content: '관리자 본인이 요청한 메일이 아니라면 조치 바랍니다.',
        action: domain + '/api/mailer/validate',
        token,
        domain: domainToken,
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

    await this.sendConfirmMail(message);

    const data = await new Promise<{ token: string } | boolean>((resolve) =>
      this.batchService.mapper.set(token, {
        resolve,
        start: Date.now(),
        email: defaultEmail,
      }),
    );

    this.batchService.clearTokenIfExists(data);

    return data;
  }

  /* 수동 메일 발송 */
  // sendManualMail(type: NoticeType, id: string) {}
}
