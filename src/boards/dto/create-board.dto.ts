import { Board } from '@prisma/client';

export class CreateBoardDto
  implements
    Omit<Board, 'id' | 'viewCount' | 'createdAt' | 'updatedAt' | 'deletedAt'>
{
  userId: string;
  order: number;
  category: string;
  title: string;
  content: string;
  isPrivate: boolean;
  isOnlyCrew: boolean;
}
