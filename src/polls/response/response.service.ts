import { Injectable } from '@nestjs/common';
import { CreateResponseDto } from './dto/create-response.dto';
import { UpdateResponseDto } from './dto/update-response.dto';
import { PrismaService } from '@database/prisma.service';

@Injectable()
export class ResponseService {
  constructor(private readonly prisma: PrismaService) {}

  create(createResponseDto: CreateResponseDto) {
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

  findOne(id: string) {
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
