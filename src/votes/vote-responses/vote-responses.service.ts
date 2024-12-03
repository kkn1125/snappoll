import { Injectable } from '@nestjs/common';
import { CreateVoteResponseDto } from './dto/create-vote-response.dto';
import { UpdateVoteResponseDto } from './dto/update-vote-response.dto';
import { PrismaService } from '@database/prisma.service';

@Injectable()
export class VoteResponsesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createVoteResponseDto: CreateVoteResponseDto) {
    const userId = createVoteResponseDto.userId;
    const voteId = createVoteResponseDto.voteId;
    const voteOptionId = createVoteResponseDto.voteOptionId;
    const data = {
      userId,
      voteId,
      voteOptionId,
    };
    return this.prisma.voteResponse.create({
      data,
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

  findOne(id: string) {
    return this.prisma.vote.findUnique({
      where: { id },
      include: {
        voteOption: true,
        voteResponse: true,
      },
    });
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
