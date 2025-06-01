import { ApiProperty } from '@nestjs/swagger';

import { Board } from './Board';
import { User } from './User';

export class BoardLike {
  @ApiProperty({ type: String })
  id!: string;
  @ApiProperty({ type: String })
  boardId!: string;
  @ApiProperty({ type: String })
  userId!: string | null;
  @ApiProperty({ type: Date })
  createdAt!: Date;
  @ApiProperty({ type: () => Board })
  board!: Board;
  @ApiProperty({ type: () => User })
  user!: User | null;
}
