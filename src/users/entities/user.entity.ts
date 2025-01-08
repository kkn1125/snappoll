import { $Enums, User as PrismaUser } from '@prisma/client';

export class User implements PrismaUser {
  id: string;
  email: string;
  username: string;
  isActive: boolean;
  lastLogin: Date;
  authProvider: $Enums.AuthProvider;
  group: $Enums.Group;
  role: $Enums.Role;
  receiveMail: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
