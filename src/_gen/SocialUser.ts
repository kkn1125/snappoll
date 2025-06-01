import { ApiProperty } from '@nestjs/swagger';

import { User } from './User';

export class SocialUser {
  @ApiProperty({ type: String })
  id!: string;
  @ApiProperty({ type: String })
  userId!: string;
  @ApiProperty({ type: String })
  provider!: string;
  @ApiProperty({ type: Date })
  createdAt!: Date;
  @ApiProperty({ type: Date })
  updatedAt!: Date;
  @ApiProperty({ type: Date })
  deletedAt!: Date | null;
  @ApiProperty({ type: () => User })
  user!: User;
}
