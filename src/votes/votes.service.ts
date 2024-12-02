import { Injectable } from '@nestjs/common';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { PrismaService } from '@database/prisma.service';

@Injectable()
export class VotesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createVoteDto: CreateVoteDto) {
    const title = createVoteDto.title;
    const description = createVoteDto.description;
    const userId = createVoteDto.userId;
    const isMultiple = createVoteDto.isMultiple;
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
        voteOption: true,
      },
    });
  }

  update(id: string, updateVoteDto: UpdateVoteDto) {
    return this.prisma.vote.update({ where: { id }, data: updateVoteDto });
  }

  remove(id: string) {
    return this.prisma.vote.delete({ where: { id } });
  }
}
