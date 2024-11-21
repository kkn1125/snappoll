import { User } from '@prisma/client';

export class CreateUserDto
  implements Pick<User, 'email' | 'username' | 'password'>
{
  email: string;
  username: string;
  password: string;
}
