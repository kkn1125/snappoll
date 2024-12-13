import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { PrismaService } from '@database/prisma.service';

@Injectable()
export class BoardsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createBoardDto: CreateBoardDto) {
    return this.prisma.board.create({ data: createBoardDto });
  }

  findAll() {
    return this.prisma.board.findMany();
  }

  findOne(id: string) {
    return this.prisma.board.findMany({ where: { id } });
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
