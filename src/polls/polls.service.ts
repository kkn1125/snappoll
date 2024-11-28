import { Injectable } from '@nestjs/common';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { PrismaService } from '@database/prisma.service';

@Injectable()
export class PollsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createPollDto: CreatePollDto) {
    return this.prisma.poll.create({
      data: createPollDto,
    });
  }

  findAll() {
    return this.prisma.poll.findMany({
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
      },
    });
  }

  findMe(id: string) {
    return this.prisma.poll.findMany({
      where: { createdBy: id },
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
      },
    });
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
      },
    });
  }

  update(id: string, updatePollDto: UpdatePollDto) {
    return this.prisma.poll.update({ where: { id }, data: updatePollDto });
  }

  remove(id: string) {
    return this.prisma.poll.delete({ where: { id } });
  }
}
