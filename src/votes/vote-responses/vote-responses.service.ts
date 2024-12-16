import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVoteResponseDto } from './dto/create-vote-response.dto';
import { UpdateVoteResponseDto } from './dto/update-vote-response.dto';
import { PrismaService } from '@database/prisma.service';

@Injectable()
export class VoteResponsesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createVoteResponseDto: CreateVoteResponseDto) {
    /* validate poll expires */
    const vote = await this.prisma.vote.findUnique({
      where: { id: createVoteResponseDto.voteId },
    });

    if (!vote) {
      const errorCode = await this.prisma.getErrorCode('vote', 'NotFound');
      throw new NotFoundException(errorCode);
    }
    if (vote.expiresAt !== null && vote.expiresAt < new Date()) {
      const errorCode = await this.prisma.getErrorCode('vote', 'AlreadyClosed');
      throw new BadRequestException(errorCode);
    }

    const userId = createVoteResponseDto.userId;
    const voteId = createVoteResponseDto.voteId;
    const voteAnswer = {
      create: createVoteResponseDto.voteAnswer.map((answer) => {
        const voteOptionId = answer.voteOptionId;
        const value = answer.value;
        return { voteOptionId, value };
      }),
    };
    return this.prisma.voteResponse.create({
      data: {
        voteId,
        userId,
        voteAnswer,
      },
    });
  }

  async createMany(createVoteResponseDto: CreateVoteResponseDto[]) {
    const temp = await Promise.all(
      createVoteResponseDto.map((dto) => {
        return this.create(dto);
      }),
    );
    return temp;
  }

  findAll() {
    return this.prisma.vote.findMany({
      include: {
        voteOption: true,
        voteResponse: true,
      },
    });
  }

  async findOne(id: string) {
    const response = await this.prisma.voteResponse.findUnique({
      where: { id },
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
    if (!response) {
      const errorCode = await this.prisma.getErrorCode(
        'voteResponse',
        'NotFound',
      );
      throw new NotFoundException(errorCode);
    }
  }

  findVoteResponses(id: string) {
    return this.prisma.voteResponse.findUnique({
      where: { id },
      include: {
        vote: {
          include: {
            voteOption: true,
          },
        },
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

  async update(id: string, updateVoteResponseDto: UpdateVoteResponseDto) {
    return this.prisma.voteResponse.update({
      where: { id },
      data: updateVoteResponseDto,
    });
  }

  remove(id: string) {
    return this.prisma.voteResponse.delete({
      where: { id },
    });
  }
}
