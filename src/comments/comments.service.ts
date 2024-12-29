import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from '@database/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(boardId: string, createCommentDto: CreateCommentDto) {
    // 하위 댓글을 달 때
    if (createCommentDto.group) {
      const parentComment = await this.prisma.comment.findUnique({
        where: { id: createCommentDto.group },
      });

      await this.prisma.comment.updateMany({
        where: {
          boardId,
          group: parentComment.group,
          order: { gt: parentComment.order },
        },
        data: { order: { increment: 1 } },
      });

      const reply = await this.prisma.comment.create({
        data: {
          ...createCommentDto,
          boardId,
          group: parentComment.group,
          layer: parentComment.layer + 1,
          order: parentComment.order + 1,
        },
      });

      return reply;
    } else {
      const comment = await this.prisma.comment.create({
        data: {
          ...createCommentDto,
          boardId,
        },
      });

      const updatedComment = await this.prisma.comment.update({
        where: { id: comment.id },
        data: {
          group: comment.id,
        },
      });

      return updatedComment;
    }
  }

  async findAll() {
    const comments = await this.prisma.comment.findMany({
      where: { deletedAt: null },
    });
    const count = await this.prisma.comment.count({
      where: { deletedAt: null },
    });
    return { comments, count };
  }

  findOne(id: number) {
    return this.prisma.comment.findUnique({ where: { id } });
  }

  async findByBoardId(id: string) {
    const comments = await this.prisma.comment.findMany({
      where: { boardId: id, deletedAt: null },
      orderBy: [
        {
          group: 'desc',
        },
        {
          order: 'asc',
        },
      ],
      include: {
        user: {
          include: {
            userProfile: true,
          },
        },
      },
    });
    const count = await this.prisma.comment.count({
      where: { boardId: id, deletedAt: null },
    });
    return { comments, count };
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return this.prisma.comment.update({
      where: { id },
      data: updateCommentDto,
    });
  }

  remove(id: number) {
    return this.prisma.comment.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
