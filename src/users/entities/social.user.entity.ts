import { SocialUser as SocialUserCls, $Enums } from '@prisma/client';
import { User } from './user.entity';

export class SocialUser implements User {
  id: string;
  email: string;
  username: string;
  isActive: boolean;
  lastLogin: Date;
  authProvider: $Enums.AuthProvider;
  // grade: $Enums.Grade;
  role: $Enums.Role;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  socialUser: SocialUserCls;
}
