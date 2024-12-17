import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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

  constructor(private readonly configService: ConfigService) {
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

  async sendConfirmMail({
    templatePath,
    context,
    ...mailOptions
  }: Mail.Options & {
    templatePath: string;
    context: Record<string, unknown>;
  }) {
    let html: string | Buffer | Mail.Options['html'] | undefined;

    const layout = await fs.readFile(
      path.join(path.resolve(), 'src', 'mailer', 'template', 'layout.hbs'),
      { encoding: 'utf-8' },
    );

    if (templatePath) {
      const template = await fs.readFile(templatePath, { encoding: 'utf-8' });
      html = Handlebars.compile(template, { strict: true })(context);
    }
    html = mailOptions.html ? mailOptions.html : html;
    const layoutTemplate = Handlebars.compile(layout, { strict: true })({
      title: context.title,
      replace: html,
    });

    const defaultName = this.configService.get('email.defaultName');
    const defaultEmail = this.configService.get('email.defaultEmail');
    const from = mailOptions.from
      ? mailOptions.from
      : `"${defaultName}" <${defaultEmail}>`;

    return this.transporter.sendMail({
      ...mailOptions,
      from,
      html: layoutTemplate,
    });
  }

  async renderTemplatePage(
    res: Response,
    filename: string,
    context: Record<string, unknown>,
  ) {
    const template = await fs.readFile(
      path.join(path.resolve(), 'src', 'mailer', 'template', filename + '.hbs'),
      { encoding: 'utf-8' },
    );
    const layout = await fs.readFile(
      path.join(path.resolve(), 'src', 'mailer', 'template', 'layout.hbs'),
      { encoding: 'utf-8' },
    );
    const content = Handlebars.compile(template, {
      strict: true,
      noEscape: true,
    })(context);

    res.send(
      Handlebars.compile(layout, {
        strict: true,
      })({ title: context.title, replace: content }),
    );
  }
}
