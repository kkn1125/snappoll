import { ApiProperty } from '@nestjs/swagger';

import { User } from './User';
import { Poll } from './Poll';
import { Answer } from './Answer';

export class Response {
  @ApiProperty({ type: String })
  id!: string;
  @ApiProperty({ type: String })
  userId!: string | null;
  @ApiProperty({ type: String })
  pollId!: string;
  @ApiProperty({ type: Date })
  createdAt!: Date;
  @ApiProperty({ type: Date })
  updatedAt!: Date;
  @ApiProperty({ type: () => User })
  user!: User | null;
  @ApiProperty({ type: () => Poll })
  poll!: Poll;
  @ApiProperty({ isArray: true, type: () => Answer })
  answer!: Answer[];
}
