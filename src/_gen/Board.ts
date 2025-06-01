import { ApiProperty } from '@nestjs/swagger';

import { User } from './User';
import { Comment } from './Comment';
import { BoardLike } from './BoardLike';

export class Board {
  @ApiProperty({ type: String })
  id!: string;
  @ApiProperty({ type: String })
  userId!: string | null;
  @ApiProperty({ type: Number })
  order!: number | null;
  @ApiProperty({ type: String })
  category!: string;
  @ApiProperty({ type: String })
  password!: string | null;
  @ApiProperty({ type: String })
  title!: string;
  @ApiProperty({ type: String })
  content!: string;
  @ApiProperty({ type: Number })
  viewCount: number = 0;
  @ApiProperty({ type: Boolean })
  isNotice: boolean = false;
  @ApiProperty({ type: Boolean })
  isPrivate: boolean = false;
  @ApiProperty({ type: Boolean })
  isOnlyCrew: boolean = false;
  @ApiProperty({ type: Date })
  createdAt!: Date;
  @ApiProperty({ type: Date })
  updatedAt!: Date;
  @ApiProperty({ type: Date })
  deletedAt!: Date | null;
  @ApiProperty({ type: () => User })
  author!: User | null;
  @ApiProperty({ isArray: true, type: () => Comment })
  comment!: Comment[];
  @ApiProperty({ isArray: true, type: () => BoardLike })
  boardLike!: BoardLike[];
}
