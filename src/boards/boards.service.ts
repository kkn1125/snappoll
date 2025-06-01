import { EventsService } from '@/events/events.service';
import { PrismaService } from '@database/prisma.service';
import SnapLoggerService from '@logger/logger.service';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Board, Prisma } from '@prisma/client';
import { EncryptManager } from '@utils/EncryptManager';
import { snakeToCamel } from '@utils/snakeToCamel';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardsService {
  boardSelect: Prisma.BoardSelect = {
    id: true,
    userId: true,
    category: true,
    title: true,
    content: true,
    // likeCount: true,
    viewCount: true,
    order: true,
    isOnlyCrew: true,
    isPrivate: true,
    isNotice: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
    author: {
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
    _count: { select: { boardLike: true } },
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: SnapLoggerService,
    private readonly eventsService: EventsService,
    private readonly encryptManager: EncryptManager,
  ) {}

  async findAllCategories(eachAmount: number) {
    const categories = ['notice', 'community', 'event', 'faq'];
    const results = await Promise.all(
      categories.map((category) =>
        this.prisma.board.findMany({
          where: { category, deletedAt: null },
          orderBy: { createdAt: 'desc' },
          take: eachAmount,
          skip: 0,
          select: this.boardSelect,
        }),
      ),
    );
    const groupingData = categories.reduce<
      Partial<Record<keyof typeof categories, Board[]>>
    >((acc, cur, index) => {
      acc[cur] = results[index];
      return acc;
    }, {});
    return groupingData;
  }

  async findAll(page: number = 1) {
    const columnList = (await this.prisma.$queryRaw`
      SELECT COLUMN_NAME column FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'board' ORDER BY ORDINAL_POSITION;
    `) as { column: string }[];
    const columns = columnList
      .filter(({ column }) => column !== 'password')
      .map(({ column }) => snakeToCamel(column));
    this.logger.info('column names:', columns);
    const boards = await this.prisma.board.findMany({
      take: 10,
      skip: (page - 1) * 10,
      orderBy: { isNotice: 'desc', createdAt: 'desc' },
      select: this.boardSelect,
    });
    const count = await this.prisma.board.count();
    return { columns, boards, count };
  }

  async viewCount(category: string, id: string) {
    const board = await this.prisma.board.findUnique({
      where: { id, category, deletedAt: null },
      select: this.boardSelect,
    });

    if (!board) {
      const errorCode = await this.prisma.getErrorCode('board', 'NotFound');
      throw new NotFoundException(errorCode);
    }

    await this.prisma.board.update({
      where: { id, category },
      select: this.boardSelect,
      data: { viewCount: { increment: 1 } },
    });
  }

  async findCategoryOne(category: string, id: string, userId?: string) {
    const board = await this.prisma.board.findUnique({
      where: { id, category, deletedAt: null },
      select: this.boardSelect,
    });
    if (!board) {
      const errorCode = await this.prisma.getErrorCode('board', 'NotFound');
      throw new NotFoundException(errorCode);
    }
    // await this.prisma.board.update({
    //   where: { id },
    //   select: this.boardSelect,
    //   data: { viewCount: { increment: 1 } },
    // });
    const getBoard = await this.prisma.board.findUnique({
      where: { id, category, deletedAt: null },
      select: {
        ...this.boardSelect,
        boardLike: {
          select: {
            id: true,
            boardId: true,
            userId: true,
            createdAt: true,
          },
        },
      },
    });

    if (userId) {
      const alreadyLike = await this.prisma.boardLike.findFirst({
        where: {
          boardId: getBoard.id,
          userId,
        },
      });
      Object.assign(getBoard, { liked: !!alreadyLike });
    }
    // this.prisma.board.aggregate();
    return getBoard;
  }

  async findCategory(category: string, page: number = 1) {
    console.time('✨ findCategory');
    // 성능을 고려하여 쿼리를 최적화하는 방법으로는
    // 필요한 데이터만 선택하고, 정렬 조건을 최소화하는 것이 좋습니다.
    // 또한, 페이징을 사용하여 한 번에 가져오는 데이터의 양을 제한합니다.
    const boards = await this.prisma.board.findMany({
      where: { category, deletedAt: null }, // 필요한 조건만으로 데이터를 필터링합니다.
      take: 10, // 한 번에 가져오는 데이터의 양을 제한합니다.
      skip: (page - 1) * 10, // 페이징을 사용하여 필요한 데이터만 가져옵니다.
      // orderBy: [{ isNotice: 'desc' }, { createdAt: 'desc' }], // 정렬 조건을 최소화하여 쿼리 성능을 향상시킵니다.
      select: this.boardSelect, // 필요한 데이터만 선택하여 가져옵니다.
    });
    // 데이터의 총 개수를 가져오는 쿼리도 최적화가 필요합니다.
    // 필요한 조건만으로 데이터의 총 개수를 계산합니다.
    const count = await this.prisma.board.count({
      where: { category, deletedAt: null }, // 필요한 조건만으로 데이터의 총 개수를 계산합니다.
    });
    console.timeEnd('✨ findCategory');
    return { board: boards, count };
  }

  async findOne(id: string) {
    const board = await this.prisma.board.findUnique({
      where: { id, deletedAt: null },
      select: this.boardSelect,
    });
    if (!board) {
      const errorCode = await this.prisma.getErrorCode('board', 'NotFound');
      throw new NotFoundException(errorCode);
    }
    return this.prisma.board.update({
      where: { id, deletedAt: null },
      data: { viewCount: { increment: 1 } },
      select: this.boardSelect,
    });
  }

  async validatePassword(id: string, password: string, isUser: boolean) {
    if (isUser) {
      const errorCode = await this.prisma.getErrorCode('board', 'Forbidden');
      throw new ForbiddenException(errorCode);
    }
    const board = await this.prisma.board.findUnique({ where: { id } });
    if (!board) {
      const errorCode = await this.prisma.getErrorCode('board', 'NotFound');
      throw new NotFoundException(errorCode);
    }
    const encryptedPassword = this.encryptManager.encryptData(password);

    return board.password === encryptedPassword;
  }

  async create(createBoardDto: CreateBoardDto, isUser: boolean) {
    if (!isUser && createBoardDto.password) {
      createBoardDto.password = this.encryptManager.encryptData(
        createBoardDto.password,
      );
    }
    if (isUser) {
      delete createBoardDto['password'];
    }

    const newBoard = await this.prisma.board.create({ data: createBoardDto });

    let author = '익명';
    if (isUser) {
      const user = await this.prisma.user.findUnique({
        where: { id: createBoardDto.userId },
        select: {
          username: true,
        },
      });
      if (user) {
        author = user.username;
      }
    }

    const content = `${createBoardDto.title} 게시글이 작성되었습니다.\n작성자: ${author}\n카테고리: ${createBoardDto.category}\n링크: https://snappoll.kro.kr/boards/${createBoardDto.category}/${newBoard.id}`;

    await this.eventsService.notifyWebhook('discord', 'new-board', content);

    return newBoard;
  }

  async update(id: string, updateBoardDto: UpdateBoardDto, isUser: boolean) {
    return this.prisma.$transaction(async () => {
      const { password, author, ...data } = updateBoardDto;
      const board = await this.prisma.board.findUnique({ where: { id } });

      if (!board) {
        const errorCode = await this.prisma.getErrorCode('board', 'NotFound');
        throw new NotFoundException(errorCode);
      }

      if (!isUser && board.password !== null) {
        if (!password) {
          const errorCode = await this.prisma.getErrorCode(
            'board',
            'Forbidden',
          );
          throw new ForbiddenException(errorCode);
        }
        const encryptedPassword = this.encryptManager.encryptData(password);
        if (board.password !== encryptedPassword) {
          const errorCode = await this.prisma.getErrorCode(
            'board',
            'Forbidden',
          );
          throw new ForbiddenException(errorCode);
        }
      }

      return this.prisma.board.update({
        where: { id },
        data: {
          title: data.title,
          content: data.content,
          category: data.category,
          isPrivate: data.isPrivate,
          isOnlyCrew: data.isOnlyCrew,
          order: data.order,
        },
      });
    });
  }

  async addLike(boardId: string, userId?: string) {
    if (!userId) {
      const errorCode = await this.prisma.getErrorCode('board', 'Forbidden');
      throw new ForbiddenException(errorCode);
    }

    return this.prisma.$transaction(async () => {
      const board = await this.prisma.board.findUnique({
        where: { id: boardId },
      });

      if (!board) {
        const errorCode = await this.prisma.getErrorCode('board', 'NotFound');
        throw new NotFoundException(errorCode);
      }

      const alreadyLike = await this.prisma.boardLike.findFirst({
        where: { boardId, userId },
      });

      if (alreadyLike) {
        const errorCode = await this.prisma.getErrorCode(
          'board',
          'AlreadyLike',
        );
        throw new BadRequestException(errorCode);
      }

      return this.prisma.boardLike.create({
        data: {
          boardId,
          userId,
          // boardLike,
        },
      });
    });
  }

  async removeLike(boardId: string, userId?: string) {
    if (!userId) {
      const errorCode = await this.prisma.getErrorCode('board', 'Forbidden');
      throw new ForbiddenException(errorCode);
    }

    return this.prisma.$transaction(async () => {
      const board = await this.prisma.board.findFirst({
        where: { id: boardId },
      });

      if (!board) {
        const errorCode = await this.prisma.getErrorCode('board', 'NotFound');
        throw new NotFoundException(errorCode);
      }

      return this.prisma.boardLike.deleteMany({
        where: { boardId, userId },
      });
    });
  }

  async remove(id: string, password: string, isUser: boolean) {
    const board = await this.prisma.board.findUnique({ where: { id } });
    if (!board) {
      const errorCode = await this.prisma.getErrorCode('board', 'NotFound');
      throw new NotFoundException(errorCode);
    }

    if (!isUser && board.password !== null) {
      if (!password) {
        const errorCode = await this.prisma.getErrorCode('board', 'Forbidden');
        throw new ForbiddenException(errorCode);
      }
      const encryptedPassword = this.encryptManager.encryptData(password);
      if (board.password !== encryptedPassword) {
        const errorCode = await this.prisma.getErrorCode('board', 'Forbidden');
        throw new ForbiddenException(errorCode);
      }
    }

    return this.prisma.board.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async removeForce(id: string) {
    const board = await this.prisma.board.findUnique({ where: { id } });
    if (!board) {
      const errorCode = await this.prisma.getErrorCode('board', 'NotFound');
      throw new NotFoundException(errorCode);
    }

    return this.prisma.board.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
