import { PrismaService } from '@database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Option } from '@prisma/client';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { CreateSharePollDto } from './dto/create-share-poll.dto';
import { EncryptManager } from '@utils/EncryptManager';

@Injectable()
export class PollsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly encryptManager: EncryptManager,
  ) {}

  /* share poll */
  findShareOneById(id: string) {
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
        response: {
          include: {
            answer: true,
          },
        },
        sharePoll: true,
      },
    });
  }

  findShareOne(url: string) {
    return this.prisma.sharePoll.findUnique({
      where: { url },
      include: {
        poll: {
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
            response: {
              include: {
                answer: true,
              },
            },
          },
        },
      },
    });
  }

  createShareUrl(createSharePollDto: CreateSharePollDto) {
    const url = this.encryptManager.generateShareUrl(
      createSharePollDto.pollId,
      'public-poll',
    );
    createSharePollDto.url = url;
    return this.prisma.sharePoll.create({ data: createSharePollDto });
  }

  revokeShareUrl(id: string) {
    return this.prisma.sharePoll.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  resumeShareUrl(id: string) {
    return this.prisma.sharePoll.update({
      where: { id },
      data: { deletedAt: null },
    });
  }

  /* polls */
  create(createPollDto: CreatePollDto) {
    const title = createPollDto.title;
    const description = createPollDto.description;
    const userId = createPollDto.userId;
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
        userId,
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
        response: true,
        sharePoll: true,
      },
    });
    const count = await this.prisma.poll.count();

    return { polls, count };
  }

  async findMe(id: string, page: number) {
    const polls = await this.prisma.poll.findMany({
      where: { userId: id },
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
        response: true,
        _count: true,
        sharePoll: true,
      },
    });
    const count = await this.prisma.poll.count({ where: { userId: id } });

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
        response: {
          include: {
            answer: true,
          },
        },
        sharePoll: true,
      },
    });
  }

  async findResponses(id: string, page: number) {
    const poll = await this.prisma.poll.findUnique({ where: { id } });
    const responses = await this.prisma.response.findMany({
      where: {
        pollId: id,
      },
      take: 10,
      skip: (page - 1) * 10,
      orderBy: {
        createdAt: 'desc',
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
    const count = await this.prisma.response.count({
      where: { pollId: id },
    });

    return { poll, responses, count };
  }

  async findResponsesMe(userId: string, page: number) {
    const responses = await this.prisma.response.findMany({
      where: {
        userId,
      },
      take: 10,
      skip: (page - 1) * 10,
      orderBy: {
        createdAt: 'desc',
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
    const count = await this.prisma.response.count({
      where: { userId },
    });

    return { responses, count };
  }

  update(id: string, updatePollDto: UpdatePollDto) {
    const title = updatePollDto.title;
    const description = updatePollDto.description;
    const userId = updatePollDto.userId;
    const expiresAt = updatePollDto.expiresAt;

    let question;
    if (
      'question' in updatePollDto &&
      updatePollDto.question instanceof Array
    ) {
      question = {
        update: updatePollDto.question.map(({ id, ...question }) => {
          let option;
          if ('option' in question && question.option instanceof Array) {
            option = {
              updateMany: question.option.map(({ id, ...option }: Option) => {
                return {
                  where: { id },
                  data: {
                    content: option.content,
                  },
                };
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
            where: { id },
            data: {
              type,
              title,
              description,
              isMultiple,
              useEtc,
              order,
              option,
            },
          };
        }),
      };
    }

    return this.prisma.poll.update({
      where: { id },
      data: {
        title,
        description,
        userId,
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

    return this.prisma.poll.update({ where: { id }, data: updatePollDto });
  }

  remove(id: string) {
    return this.prisma.poll.delete({ where: { id } });
  }
}
