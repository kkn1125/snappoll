import { $Enums, Grade, LocalUser, SocialUser, User } from '@prisma/client';

class CreateLocalUserDto implements Omit<LocalUser, 'id' | 'signupDate'> {
  userId: string;
  password: string;
}

class CreateSocialUserDto
  implements Omit<SocialUser, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
{
  userId: string;
  provider: string;
}

export class CreateUserDto
  implements
    Omit<
      User,
      | 'id'
      | 'isActive'
      | 'role'
      | 'authProvider'
      | 'grade'
      | 'lastLogin'
      | 'createdAt'
      | 'updatedAt'
      | 'deletedAt'
    >,
    Partial<CreateLocalUserDto>,
    Partial<CreateSocialUserDto>
{
  email: string;
  username: string;
  role?: $Enums.Role;
  authProvider?: $Enums.AuthProvider;
  /* common user */
  userId?: string;
  /* local user */
  password?: string;
  /* social user */
  provider?: string;
  grade?: $Enums.Grade;
}
