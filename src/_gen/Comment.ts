import { ApiProperty } from '@nestjs/swagger';

import { User } from './User';
import { Board } from './Board';

export class Comment {
  @ApiProperty({ type: Number })
  id!: number;
  @ApiProperty({ type: String })
  boardId!: string;
  @ApiProperty({ type: String })
  userId!: string | null;
  @ApiProperty({ type: String })
  content!: string;
  @ApiProperty({ type: Boolean })
  isAuthorOnly: boolean = false;
  @ApiProperty({ type: Number })
  group!: number | null;
  @ApiProperty({ type: Number })
  layer: number = 0;
  @ApiProperty({ type: Number })
  order: number = 0;
  @ApiProperty({ type: Number })
  likeCount: number = 0;
  @ApiProperty({ type: Date })
  createdAt!: Date;
  @ApiProperty({ type: Date })
  updatedAt!: Date;
  @ApiProperty({ type: Date })
  deletedAt!: Date | null;
  @ApiProperty({ type: () => User })
  user!: User | null;
  @ApiProperty({ type: () => Board })
  board!: Board;
}
