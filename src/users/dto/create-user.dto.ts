import {
  $Enums,
  LocalUser,
  Plan,
  SocialUser,
  SubscribeType,
  User,
} from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';

class CreateLocalUserDto
  implements Omit<LocalUser, 'id' | 'userId' | 'signupDate'>
{
  // userId: string;
  password: string;
}

class CreateSocialUserDto
  implements
    Omit<SocialUser, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'deletedAt'>
{
  // userId: string;
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

  // @IsNotEmpty()
  // @IsEnum($Enums.Role)
  // @Transform(({ value }) => value || $Enums.Role.User)
  // role?: $Enums.Role;

  // @IsNotEmpty()
  // @IsEnum($Enums.AuthProvider)
  @Transform(({ value }) => value || $Enums.AuthProvider.Local)
  authProvider?: $Enums.AuthProvider;

  /* common user */
  // @IsNotEmpty()
  // @IsString()
  // userId: string;

  /* local user */
  // @IsNotEmpty()
  @IsString()
  @Length(5, 12)
  password?: string;

  /* social user */
  // @IsNotEmpty()
  // @IsString()
  provider?: string;

  // @IsNotEmpty()
  // @IsEnum($Enums.PlanType)
  plan?: $Enums.PlanType;

  // @IsNotEmpty()
  // @IsEnum($Enums.SubscribeType, { always: false })
  @Transform(({ value }) => value || $Enums.SubscribeType.Monthly)
  subscribeType?: $Enums.SubscribeType;
}
