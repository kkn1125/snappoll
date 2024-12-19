import { PrismaService } from '@database/prisma.service';
import { Injectable } from '@nestjs/common';
import { $Enums } from '@prisma/client';

@Injectable()
export class ViewsService {
  constructor(private readonly prisma: PrismaService) {}

  findUsers() {
    return this.prisma.user.findMany({
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    });
  }

  findBoards() {
    return this.prisma.board.findMany({
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    });
  }

  changeGradeFromId(id: string, grade: $Enums.Grade) {
    return this.prisma.user.update({
      where: { id },
      data: { grade },
    });
  }

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
}
