import { LIMIT } from '@common/variables';
import { PrismaService } from '@database/prisma.service';
import SnapLoggerService from '@logger/logger.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EncryptManager } from '@utils/EncryptManager';
import dayjs from 'dayjs';
import { CreateShareVoteDto } from './dto/create-share-vote.dto';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';

@Injectable()
export class VotesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: SnapLoggerService,
    private readonly encryptManager: EncryptManager,
  ) {}

  /* share vote */
  findShareOneById(id: string) {
    return this.prisma.vote.findUnique({
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
        voteOption: {
          include: {
            voteAnswer: true,
          },
        },
        shareVote: true,
      },
    });
  }

  findShareOne(url: string) {
    return this.prisma.shareVote.findUnique({
      where: { url },
      include: {
        vote: {
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
            voteOption: {
              include: {
                voteAnswer: true,
              },
            },
          },
        },
      },
    });
  }

  createShareUrl(createShareVoteDto: CreateShareVoteDto) {
    const url = this.encryptManager.generateShareUrl(
      createShareVoteDto.voteId,
      'public-vote',
    );
    createShareVoteDto.url = url;
    return this.prisma.shareVote.create({ data: createShareVoteDto });
  }

  revokeShareUrl(id: string) {
    return this.prisma.shareVote.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  resumeShareUrl(id: string) {
    return this.prisma.shareVote.update({
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

    // 나의 투표 수
    const voteCount = await this.prisma.vote.count({
      where: {
        userId: id,
        createdAt: {
          gte: dayjs().startOf('M').toISOString(),
          lte: dayjs().endOf('M').toISOString(),
        },
      },
    });

    // 나의 응답 수
    const voteResponseCount = await this.prisma.voteResponse.count({
      where: { userId: id },
    });

    // 나의 응답들
    const responses = await this.prisma.voteResponse.findMany({
      where: { userId: id },
    });

    // 내가 작성한 투표의 응답들
    const respondents = await this.prisma.voteResponse.findMany({
      where: {
        vote: {
          userId: id,
          createdAt: {
            gte: dayjs().startOf('M').toISOString(),
            lte: dayjs().endOf('M').toISOString(),
          },
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

    // 주간 나의 투표에 응답 수 분포
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

    const totalUsage = await this.prisma.vote.count({
      where: { userId: id },
    });

    return {
      weeks,
      voteCount,
      voteResponseCount,
      responsesWeek,
      respondentWeek,
      totalUsage,
    };
  }

  /* votes */
  create(createVoteDto: CreateVoteDto) {
    this.prisma.$transaction(async () => {
      const title = createVoteDto.title;
      const description = createVoteDto.description;
      const userId = createVoteDto.userId;
      const isMultiple = createVoteDto.isMultiple;
      const useEtc = createVoteDto.useEtc;
      const expiresAt = createVoteDto.expiresAt;

      let voteOption;
      if (
        'voteOption' in createVoteDto &&
        createVoteDto.voteOption instanceof Array
      ) {
        voteOption = {
          create: createVoteDto.voteOption.map((option) => {
            const content = option.content;
            return {
              content,
            };
          }),
        };
      }

      const data = {
        title,
        description,
        userId,
        isMultiple,
        useEtc,
        expiresAt,
        voteOption,
      };

      return this.prisma.vote.create({
        data,
        include: {
          voteOption: true,
        },
      });
    });
  }

  async findAll(page: number) {
    const votes = await this.prisma.vote.findMany({
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
        voteOption: true,
        voteResponse: true,
        shareVote: true,
      },
    });
    const count = await this.prisma.vote.count();

    return { votes, count };
  }

  async findMe(id: string, page: number) {
    const votes = await this.prisma.vote.findMany({
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
        voteOption: true,
        voteResponse: {
          include: {
            voteAnswer: true,
          },
        },
        shareVote: true,
      },
    });
    const count = await this.prisma.vote.count({ where: { userId: id } });

    return { votes, count };
  }

  async findOne(id: string) {
    const validVote = await this.prisma.vote.findUnique({
      where: { id },
    });

    const isExpired =
      validVote.expiresAt && dayjs(validVote.expiresAt).isBefore(dayjs());

    const vote = await this.prisma.vote.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            createdAt: true,
            updatedAt: true,
            subscription: {
              include: {
                plan: {
                  select: {
                    planType: true,
                  },
                },
              },
            },
          },
        },
        voteOption: isExpired
          ? undefined
          : {
              include: {
                voteAnswer: true,
              },
            },
        voteResponse: isExpired
          ? undefined
          : {
              include: {
                voteAnswer: true,
              },
            },
        shareVote: true,
      },
    });

    const convertedVote = { ...vote, limit: 0 };
    if (convertedVote.user.subscription.plan.planType === 'Free') {
      convertedVote.limit = LIMIT.FREE.RESPONSE.VOTE;
    } else if (convertedVote.user.subscription.plan.planType === 'Basic') {
      convertedVote.limit = LIMIT.BASIC.RESPONSE.VOTE;
    } else if (convertedVote.user.subscription.plan.planType === 'Pro') {
      convertedVote.limit = LIMIT.PRO.RESPONSE.VOTE;
    }
    return convertedVote;
  }

  async getGraphData(id: string, userId: string) {
    const vote = await this.prisma.vote.findUnique({ where: { id } });
    if (vote.userId !== userId) {
      throw new UnauthorizedException(
        'You are not allowed to access this vote',
      );
    }
    return vote;
  }

  async findResponses(id: string, page: number) {
    const vote = await this.prisma.vote.findUnique({ where: { id } });

    const responses = await this.prisma.voteResponse.findMany({
      where: {
        voteId: id,
      },
      take: 10,
      skip: (page - 1) * 10,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        vote: {
          include: {
            voteOption: true,
          },
        },
        voteAnswer: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });
    const count = await this.prisma.voteResponse.count({
      where: { voteId: id },
    });

    return { vote, responses, count };
  }

  async findResponsesMe(userId: string, page: number) {
    const responses = await this.prisma.voteResponse.findMany({
      where: {
        userId,
      },
      take: 10,
      skip: (page - 1) * 10,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        vote: {
          include: {
            voteOption: true,
          },
        },
        voteAnswer: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });
    const count = await this.prisma.voteResponse.count({
      where: { userId },
    });

    return { responses, count };
  }

  async update(id: string, updateVoteDto: UpdateVoteDto) {
    const title = updateVoteDto.title;
    const description = updateVoteDto.description;
    const userId = updateVoteDto.userId;
    const isMultiple = updateVoteDto.isMultiple;
    const useEtc = updateVoteDto.useEtc;
    const expiresAt = updateVoteDto.expiresAt || null;

    const voteOption = updateVoteDto.voteOption;

    await this.prisma.vote.update({
      where: { id },
      data: {
        title,
        description,
        userId,
        isMultiple,
        useEtc,
        expiresAt,
      },
    });

    await this.prisma.voteOption.deleteMany({
      where: {
        voteId: id,
        id: { notIn: voteOption.map((option) => option.id) },
      },
    });

    for (const { voteAnswer, ...option } of voteOption) {
      await this.prisma.voteOption.upsert({
        where: { id: option.id },
        create: option,
        update: option,
      });
    }

    return this.prisma.vote.findUnique({
      where: { id },
    });
  }

  remove(id: string) {
    this.logger.debug(id);
    return this.prisma.vote.delete({ where: { id } });
  }
}
