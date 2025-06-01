import { ApiProperty } from '@nestjs/swagger';

import { User } from './User';

export class LocalUser {
  @ApiProperty({ type: String })
  id!: string;
  @ApiProperty({ type: String })
  userId!: string;
  @ApiProperty({ type: String })
  password!: string;
  @ApiProperty({ type: Date })
  signupDate!: Date;
  @ApiProperty({ type: () => User })
  user!: User;
}
