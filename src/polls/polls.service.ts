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

  async findAll(page: number) {
    const polls = await this.prisma.poll.findMany({
      take: 10,
      skip: (page - 1) * 10,
      orderBy: {
        createdAt: 'desc',
      },
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
    const count = await this.prisma.poll.count();

    return { polls, count };
  }

  async findMe(id: string, page: number) {
    const polls = await this.prisma.poll.findMany({
      where: { createdBy: id },
      take: 10,
      skip: (page - 1) * 10,
      orderBy: {
        createdAt: 'desc',
      },
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
        _count: true,
      },
    });
    const count = await this.prisma.poll.count({ where: { createdBy: id } });

    return { polls, count };
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

  findResponses(id: string) {
    // return this.prisma.poll.findUnique({
    //   where: { id },
    //   include: {
    //     response: {
    //       include: {
    //         answer: true,
    //       },
    //     },
    //     question: {
    //       include: {
    //         option: true,
    //         answer: true,
    //       },
    //     },
    //   },
    // });
    return this.prisma.response.findMany({
      where: {
        pollId: id,
      },
      include: {
        poll: {
          include: {
            question: true,
          },
        },
        answer: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
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
