import { PrismaService } from '@database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Option } from '@prisma/client';
import { EncryptManager } from '@utils/EncryptManager';
import SnapLogger from '@utils/SnapLogger';
import dayjs from 'dayjs';
import { CreatePollDto } from './dto/create-poll.dto';
import { CreateSharePollDto } from './dto/create-share-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';

@Injectable()
export class PollsService {
  logger = new SnapLogger(this);

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

  /* results */
  async getMyResults(id: string) {
    /* 주간 일자 배열 생성 */
    const now = dayjs();
    const todayNumber = now.day();
    const sunday = now.add(6 - todayNumber, 'd');
    const weeks = Array.from(Array(7), (_, i) => {
      return sunday.subtract(7 - i - 1, 'day').format('YYYY-MM-DD');
    });

    // 나의 설문 수
    const pollCount = await this.prisma.poll.count({
      where: { userId: id },
    });

    // 나의 응답 수
    const pollResponseCount = await this.prisma.response.count({
      where: { userId: id },
    });

    // 나의 응답들
    const responses = await this.prisma.response.findMany({
      where: { userId: id },
    });

    // 내가 작성한 설문의 응답들
    const respondents = await this.prisma.response.findMany({
      where: {
        poll: {
          userId: id,
        },
      },
    });

    // 주간 나의 응답 수 분포
    const responsesWeek =
      responses.reduce(
        (acc: number[], response) => {
          const date = dayjs(response.createdAt).format('YYYY-MM-DD');
          const index = weeks.indexOf(date);
          if (!acc[index]) {
            acc[index] = 0;
          }
          acc[index] += 1;
          return acc;
        },
        Array.from({ length: 7 }, () => 0),
      ) ?? [];

    // 주간 나의 설문에 응답 수 분포
    const respondentWeek =
      respondents.reduce(
        (acc: number[], response) => {
          const date = dayjs(response.createdAt).format('YYYY-MM-DD');
          const index = weeks.indexOf(date);
          if (!acc[index]) {
            acc[index] = 0;
          }
          acc[index] += 1;
          return acc;
        },
        Array.from({ length: 7 }, () => 0),
      ) ?? [];
    return {
      weeks,
      pollCount,
      pollResponseCount,
      responsesWeek,
      respondentWeek,
    };
  }

  /* polls */
  create(createPollDto: CreatePollDto) {
    return this.prisma.$transaction(async () => {
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
            const isRequired = question.isRequired;
            const useEtc = question.useEtc;
            const order = question.order;
            return {
              type,
              title,
              description,
              isMultiple,
              isRequired,
              useEtc,
              order,
              option,
            };
          }),
        };
      }

      const data = {
        title,
        description,
        userId,
        expiresAt,
        question,
      };

      return this.prisma.poll.create({
        data,
        include: {
          question: {
            include: {
              option: true,
            },
          },
        },
      });
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
          orderBy: {
            order: 'asc',
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
    return this.prisma.$transaction(async () => {
      const title = updatePollDto.title;
      const description = updatePollDto.description;
      const userId = updatePollDto.userId;
      const expiresAt = updatePollDto.expiresAt;
      const questions = updatePollDto.question;

      await this.prisma.poll.update({
        where: { id },
        data: {
          title,
          description,
          userId,
          expiresAt,
        },
      });

      await this.prisma.question.deleteMany({
        where: {
          pollId: id,
          id: { notIn: questions.map((question) => question.id) },
        },
      });

      for (const { option: options, id, answer, ...question } of questions) {
        const questionId = id;
        // this.logger.debug(id, question);
        await this.prisma.question.upsert({
          where: { id },
          create: question,
          update: question,
        });
        if (question.type !== 'text') {
          for (const { id, ...option } of options) {
            await this.prisma.option.deleteMany({
              where: {
                questionId,
                id: { notIn: options.map((option) => option.id) },
              },
            });
            await this.prisma.option.upsert({
              where: { id },
              create: option,
              update: option,
            });
          }
        }
      }

      return this.prisma.poll.findUnique({
        where: { id },
      });
    });
  }

  remove(id: string) {
    return this.prisma.poll.delete({ where: { id } });
  }
}
