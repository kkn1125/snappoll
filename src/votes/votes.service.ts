import { Injectable } from '@nestjs/common';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { PrismaService } from '@database/prisma.service';
import { CreateShareVoteDto } from './dto/create-share-vote.dto';
import { EncryptManager } from '@utils/EncryptManager';

@Injectable()
export class VotesService {
  constructor(
    private readonly prisma: PrismaService,
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

  /* votes */
  create(createVoteDto: CreateVoteDto) {
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

  findOne(id: string) {
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
    console.log('expiresAt', expiresAt);

    let voteOption;
    if (
      'voteOption' in updateVoteDto &&
      updateVoteDto.voteOption instanceof Array
    ) {
      voteOption = {
        updateMany: updateVoteDto.voteOption.map(({ id, ...option }) => ({
          where: { id },
          data: {
            content: option.content,
          },
        })),
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
    return this.prisma.vote.update({
      where: { id },
      data,
      include: {
        voteOption: true,
      },
    });
  }

  remove(id: string) {
    console.log(id);
    return this.prisma.vote.delete({ where: { id } });
  }
}
