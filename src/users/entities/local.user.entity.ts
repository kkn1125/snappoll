import { LocalUser as LocalUserCls, $Enums } from '@prisma/client';
import { User } from './user.entity';

export class LocalUser implements User {
  id: string;
  email: string;
  username: string;
  isActive: boolean;
  lastLogin: Date;
  authProvider: $Enums.AuthProvider;
  grade: $Enums.Grade;
  role: $Enums.Role;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  localUser: LocalUserCls;
}
