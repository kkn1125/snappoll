import { $Enums, User as PrismaUser } from '@prisma/client';

export class User implements PrismaUser {
  id: string;
  email: string;
  username: string;
  isActive: boolean;
  lastLogin: Date;
  authProvider: $Enums.AuthProvider;
  role: $Enums.Role;
  // grade: $Enums.Grade;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  // id: string;
  // email: string;
  // username: string;
  // password: string;
  // createdAt: Date;
  // updatedAt: Date;
  // deletedAt: Date | null;
}
