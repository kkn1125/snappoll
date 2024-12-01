import { PrismaService } from '@database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Option } from '@prisma/client';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';

@Injectable()
export class PollsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createPollDto: CreatePollDto) {
    const title = createPollDto.title;
    const description = createPollDto.description;
    const createdBy = createPollDto.createdBy;
    const expiresAt = createPollDto.expiresAt;

    let question;
    if ('question' in createPollDto) {
      question = {
        create: createPollDto.question.map((question) => {
          let option;
          if ('option' in question && question.option instanceof Array) {
            option = {
              create: question.option.map((option: Option) => {
                return { content: option.content };
              }),
            };
          }

          const type = question.type;
          const title = question.title;
          const description = question.description;
          const isMultiple = question.isMultiple;
          const useEtc = question.useEtc;
          const order = question.order;
          return {
            type,
            title,
            description,
            isMultiple,
            useEtc,
            order,
            option,
          };
        }),
      };
    }

    return this.prisma.poll.create({
      data: {
        title,
        description,
        createdBy,
        expiresAt,
        question,
      },
      include: {
        question: {
          include: {
            option: true,
          },
        },
      },
    });
  }

  findAll() {
    return this.prisma.poll.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  }

  findMe(id: string) {
    return this.prisma.poll.findMany({
      where: { createdBy: id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.poll.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        question: {
          include: {
            option: true,
            answer: true,
          },
        },
      },
    });
  }

  update(id: string, updatePollDto: UpdatePollDto) {
    return this.prisma.poll.update({ where: { id }, data: updatePollDto });
  }

  remove(id: string) {
    return this.prisma.poll.delete({ where: { id } });
  }
}
