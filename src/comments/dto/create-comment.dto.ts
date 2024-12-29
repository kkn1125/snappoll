import { Comment } from '@prisma/client';

export class CreateCommentDto
  implements
    Omit<
      Comment,
      | 'id'
      | 'userId'
      | 'boardId'
      | 'group'
      | 'layer'
      | 'order'
      | 'likeCount'
      | 'createdAt'
      | 'updatedAt'
      | 'deletedAt'
    >
{
  isAuthorOnly: boolean;
  userId?: string;
  content: string;
  group?: number;
  // layer: number;
  // order: number;
}
