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
import { snakeToCamel } from '@utils/snakeToCamel';

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

  async findAll(page: number) {
    const notices = await this.prisma.notice.findMany({
      skip: (page - 1) * 10,
      take: 10,
      orderBy: { createdAt: 'desc' },
    });
    const columnList = (await this.prisma
      .$queryRaw`SELECT COLUMN_NAME column FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'notice' ORDER BY ORDINAL_POSITION`) as {
      column: string;
    }[];
    const columns = columnList.map(({ column }) => snakeToCamel(column));
    const count = await this.prisma.notice.count();

    return { notices, columns, count };
  }

  findOne(id: string) {
    return this.prisma.notice.findUnique({ where: { id } });
  }

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

  update(id: string, updateNoticeDto: UpdateNoticeDto) {
    return `This action updates a #${id} notice`;
  }

  remove(id: string) {
    return this.prisma.notice.delete({
      where: { id },
    });
  }
}
