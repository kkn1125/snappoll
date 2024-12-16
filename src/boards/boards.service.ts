import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { PrismaService } from '@database/prisma.service';

@Injectable()
export class BoardsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createBoardDto: CreateBoardDto) {
    return this.prisma.board.create({ data: createBoardDto });
  }

  async findAll(page: number = 1) {
    const boards = await this.prisma.board.findMany({
      take: 10,
      skip: (page - 1) * 10,
      orderBy: { createdAt: 'desc' },
      include: { author: true },
    });
    const count = await this.prisma.board.count();
    return { board: boards, count };
  }

  async findCategoryOne(category: string, id: string) {
    const board = await this.prisma.board.findUnique({
      where: { id, category },
      include: {
        author: true,
      },
    });
    if (!board) {
      const errorCode = await this.prisma.getErrorCode('board', 'NotFound');
      throw new NotFoundException(errorCode);
    }
    return board;
  }

  async findCategory(category: string, page: number = 1) {
    const boards = await this.prisma.board.findMany({
      where: { category },
      take: 10,
      skip: (page - 1) * 10,
      orderBy: { createdAt: 'desc' },
      include: {
        author: true,
      },
    });
    const count = await this.prisma.board.count({ where: { category } });
    return { board: boards, count };
  }

  async findOne(id: string) {
    const board = await this.prisma.board.findUnique({
      where: { id },
      include: { author: true },
    });
    if (!board) {
      const errorCode = await this.prisma.getErrorCode('board', 'NotFound');
      throw new NotFoundException(errorCode);
    }
    return this.prisma.board.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
  }

  update(id: string, updateBoardDto: UpdateBoardDto) {
    return this.prisma.board.update({ where: { id }, data: updateBoardDto });
  }

  remove(id: string) {
    return this.prisma.board.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
