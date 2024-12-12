import { PartialType } from '@nestjs/mapped-types';

class ChangeUserPassword {
  email: string;
  username: string;
  currentPassword: string;
  password: string;
}

export class UpdateUserPasswordDto extends PartialType(ChangeUserPassword) {}
