import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateResponseDto } from './dto/create-response.dto';
import { UpdateResponseDto } from './dto/update-response.dto';
import { PrismaService } from '@database/prisma.service';

@Injectable()
export class ResponseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createResponseDto: CreateResponseDto) {
    /* validate poll expires */
    const poll = await this.prisma.poll.findUnique({
      where: { id: createResponseDto.pollId },
    });

    if (!poll) {
      throw new BadRequestException('잘못된 요청입니다.');
    }
    if (poll.expiresAt !== null && poll.expiresAt < new Date()) {
      throw new BadRequestException('이미 진행 마감된 설문지입니다.');
    }

    const userId = createResponseDto.userId;
    const pollId = createResponseDto.pollId;
    const answer = {
      create: createResponseDto.answer.map((answer) => {
        const questionId = answer.questionId;
        const optionId = answer.optionId;
        const value = answer.value;
        return { questionId, optionId, value };
      }),
    };
    return this.prisma.response.create({
      data: {
        pollId,
        userId,
        answer,
      },
    });
  }

  findAll() {
    return this.prisma.response.findMany({
      include: {
        poll: {
          include: {
            question: {
              include: { answer: true, option: true },
            },
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

  async findOne(id: string) {
    return this.prisma.response.findUnique({
      where: { id },
      include: {
        poll: {
          include: {
            question: {
              include: { answer: true, option: true },
            },
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

  update(id: string, updateResponseDto: UpdateResponseDto) {
    return this.prisma.response.update({
      where: { id },
      data: updateResponseDto,
    });
  }

  remove(id: string) {
    return this.prisma.response.delete({
      where: { id },
    });
  }
}
