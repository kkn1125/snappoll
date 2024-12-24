import { PrismaService } from '@database/prisma.service';
import { Injectable } from '@nestjs/common';
import { $Enums } from '@prisma/client';

@Injectable()
export class ViewsService {
  constructor(private readonly prisma: PrismaService) {}

  parseToken(token: any) {
    return this.prisma.parseToken(token);
  }

  findUsers() {
    return this.prisma.user.findMany({
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    });
  }

  findBoards() {
    return this.prisma.board.findMany({
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      include: {
        author: true,
      },
    });
  }

  // changeGradeFromId(id: string, plan: $Enums.PlanType.Free) {
  //   return this.prisma.user.update({
  //     where: { id },
  //     data: { grade },
  //   });
  // }

  changeRoleFromId(id: string, role: $Enums.Role) {
    return this.prisma.user.update({
      where: { id },
      data: { role },
    });
  }

  activateFromId(id: string, activate: boolean) {
    return this.prisma.user.update({
      where: { id },
      data: { isActive: activate },
    });
  }

  revokeFromId(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { deletedAt: null },
    });
  }

  deleteUserFromId(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async login({ email, password }: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { localUser: true },
    });
    if (!user) {
      return false;
    }
    const encryptedPassword = this.prisma.encryptPassword(password);
    if (user.localUser.password !== encryptedPassword) {
      return false;
    }

    const { token, refreshToken } = this.prisma.getToken({
      id: user.id,
      username: user.username,
      email: user.email,
      authProvider: user.authProvider,
      loginAt: Date.now(),
    });

    return { token, refreshToken };
  }

  crewOrAllFromId(id: string, isOnlyCrew: boolean) {
    return this.prisma.board.update({
      where: { id },
      data: { isOnlyCrew },
    });
  }

  publicOrPrivateFromId(id: string, isPrivate: boolean) {
    return this.prisma.board.update({
      where: { id },
      data: { isPrivate },
    });
  }

  categoryFromId(id: string, category: string) {
    return this.prisma.board.update({
      where: { id },
      data: { category },
    });
  }

  deleteBoardFromId(id: string) {
    return this.prisma.board.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  createUser({
    username,
    email,
    password,
    authProvider,
  }: {
    username: string;
    email: string;
    password: string;
    authProvider: $Enums.AuthProvider;
  }) {
    const encryptedPassword = this.prisma.encryptPassword(password);
    return this.prisma.user.create({
      data: {
        username,
        email,
        authProvider,
        localUser: {
          create: {
            password: encryptedPassword,
          },
        },
      },
      include: {
        localUser: true,
      },
    });
  }

  createBoard({
    title,
    content,
    category,
    userId,
  }: {
    title: string;
    content: string;
    category: string;
    userId: string;
  }) {
    return this.prisma.board.create({
      data: {
        title,
        content,
        category,
        userId,
      },
    });
  }
}
