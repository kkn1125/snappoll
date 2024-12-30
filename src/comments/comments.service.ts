import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from '@database/prisma.service';
import SnapLogger from '@utils/SnapLogger';

@Injectable()
export class CommentsService {
  logger = new SnapLogger(this);

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
      this.logger.info('new Comment:', comment);
      const updatedComment = await this.prisma.comment.update({
        where: { id: comment.id },
        data: {
          group: comment.id,
        },
      });

      return updatedComment;
    }
  }

  // async findAll() {
  //   const comments = await this.prisma.comment.findMany();
  //   const count = await this.prisma.comment.count();
  //   return { comments, count };
  // }

  findOne(id: number) {
    return this.prisma.comment.findUnique({ where: { id } });
  }

  async findByBoardId(id: string) {
    const comments = await this.prisma.comment.findMany({
      where: { boardId: id },
      orderBy: [
        {
          group: 'desc',
        },
        {
          order: 'asc',
        },
      ],
      select: {
        id: true,
        content: true,
        isAuthorOnly: true,
        likeCount: true,
        userId: true,
        boardId: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        group: true,
        layer: true,
        order: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            userProfile: {
              select: {
                id: true,
              },
            },
          },
        },
        board: {
          select: {
            userId: true,
          },
        },
      },
    });
    const count = await this.prisma.comment.count({
      where: { boardId: id },
    });
    return { comments, count };
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return this.prisma.comment.update({
      where: { id },
      data: updateCommentDto,
    });
  }

  revoke(id: number) {
    return this.prisma.comment.update({
      where: { id },
      data: { deletedAt: null },
    });
  }

  remove(id: number) {
    return this.prisma.comment.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  removeForce(id: number) {
    return this.prisma.comment.delete({
      where: { id },
    });
  }
}
