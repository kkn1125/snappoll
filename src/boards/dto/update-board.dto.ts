import { PartialType } from '@nestjs/mapped-types';
import { CreateBoardDto } from './create-board.dto';
import { User } from '@prisma/client';

export class UpdateBoardDto extends PartialType(CreateBoardDto) {
  author: User;
  // likeCount: number;
  viewCount: number;
}
