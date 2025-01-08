import { $Enums, LocalUser, SocialUser, User } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString, Length } from 'class-validator';

class CreateLocalUserDto
  implements Omit<LocalUser, 'id' | 'userId' | 'signupDate'>
{
  password: string;
}

class CreateSocialUserDto
  implements
    Omit<SocialUser, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'deletedAt'>
{
  provider: string;
}

export class CreateUserDto
  implements
    Omit<
      User,
      | 'id'
      | 'isActive'
      | 'group'
      | 'role'
      | 'authProvider'
      | 'lastLogin'
      | 'createdAt'
      | 'updatedAt'
      | 'deletedAt'
    >,
    Partial<CreateLocalUserDto>,
    Partial<CreateSocialUserDto>
{
  @IsNotEmpty()
  @IsString()
  @Length(3)
  email: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @Transform(({ value }) => value || $Enums.AuthProvider.Local)
  authProvider?: $Enums.AuthProvider;

  /* common user */

  /* local user */
  @IsString()
  @Length(5, 12)
  password?: string;

  @IsBoolean()
  receiveMail: boolean;

  /* social user */
  provider?: string;

  group?: $Enums.Group;
  role?: $Enums.Role;
  plan?: $Enums.PlanType;

  @Transform(({ value }) => value || $Enums.SubscribeType.Monthly)
  subscribeType?: $Enums.SubscribeType;
}
