import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
      const errorCode = await this.prisma.getErrorCode('poll', 'NotFound');
      throw new NotFoundException(errorCode);
    }
    if (poll.expiresAt !== null && poll.expiresAt < new Date()) {
      const errorCode = await this.prisma.getErrorCode('poll', 'AlreadyClosed');
      throw new BadRequestException(errorCode);
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
    const response = await this.prisma.response.findUnique({
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

    if (!response) {
      const errorCode = await this.prisma.getErrorCode(
        'pollResponse',
        'NotFound',
      );
      throw new NotFoundException(errorCode);
    }

    return response;
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
