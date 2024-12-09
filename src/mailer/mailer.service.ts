import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class MailerService {
  from: string = 'devkimsonhelper@gmail.com';

  transporter: nodemailer.Transporter<
    SMTPTransport.SentMessageInfo,
    SMTPTransport.Options
  >;

  constructor(private readonly configService: ConfigService) {}

  sendConfirmMail(message: Mail.Options) {
    const emailAddress = this.configService.get('email.ADDRESS');
    const emailPassword = this.configService.get('email.PASSWORD');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.google.com',
      port: 587,
      secure: false, // true for port 465, false for other ports
      auth: {
        user: emailAddress,
        pass: emailPassword,
      },
    });

    return transporter.sendMail(message);
  }
}
