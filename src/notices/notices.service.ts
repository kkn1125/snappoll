import { MailerService } from '@/mailer/mailer.service';
import { PrismaService } from '@database/prisma.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import SnapLogger from '@utils/SnapLogger';

@Injectable()
export class NoticesService {
  logger = new SnapLogger(this);

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService,
  ) {}

  create(createNoticeDto: CreateNoticeDto) {
    return this.prisma.notice.create({
      data: createNoticeDto,
    });
  }

  findAll() {
    return this.prisma.notice.findMany();
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} notice`;
  // }

  async sendMail(id: string) {
    this.logger.debug('notice id:', id);
    const allowMailUsers = await this.prisma.user.findMany({
      where: {
        receiveMail: true,
        deletedAt: null,
      },
    });
    this.logger.debug('user size:', allowMailUsers.length);
    const notice = await this.prisma.notice.findUnique({
      where: { id },
    });

    if (!notice) {
      const errorCode = await this.prisma.getErrorCode('notice', 'NotFound');
      throw new NotFoundException(errorCode);
    }

    if (notice.type !== 'Normal') {
      const errorCode = await this.prisma.getErrorCode('notice', 'BadRequest');
      throw new BadRequestException(errorCode);
    }

    const defaultName = this.configService.get('email.defaultName');
    const defaultEmail = this.configService.get('email.defaultEmail');
    const context = {
      title: notice.title,
      content: notice.content,
      email: defaultEmail,
      notice: true,
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

    return Promise.all(
      allowMailUsers.map((user) => {
        this.logger.debug('user email:', user.email);
        const message = {
          to: user.email,
          subject: 'SnapPoll',
          text: '메일 수신 허용 회원님께 발송되는 메일입니다.',
        };
        return this.mailerService.transporter.sendMail({
          ...message,
          from: `"${defaultName}" <${defaultEmail}>`,
          html: template,
        });
      }),
    );
  }

  update(id: number, updateNoticeDto: UpdateNoticeDto) {
    return `This action updates a #${id} notice`;
  }

  remove(id: number) {
    return `This action removes a #${id} notice`;
  }
}
