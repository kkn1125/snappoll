import { ApiProperty } from '@nestjs/swagger';

import { User } from './User';

export class UserProfile {
  @ApiProperty({ type: String })
  id!: string;
  @ApiProperty({ type: String })
  userId!: string;
  @ApiProperty({ type: String })
  filename!: string;
  @ApiProperty({ type: Buffer })
  image!: Buffer;
  @ApiProperty({ type: String })
  mimetype!: string;
  @ApiProperty({ type: Date })
  createdAt!: Date;
  @ApiProperty({ type: () => User })
  user!: User;
}
