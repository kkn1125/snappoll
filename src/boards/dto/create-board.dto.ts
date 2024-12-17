import { Board } from '@prisma/client';

export class CreateBoardDto
  implements
    Omit<
      Board,
      'id' | 'userId' | 'viewCount' | 'createdAt' | 'updatedAt' | 'deletedAt'
    >
{
  password: string;
  userId?: string;
  order: number;
  category: string;
  title: string;
  content: string;
  isPrivate: boolean;
  isOnlyCrew: boolean;
}
