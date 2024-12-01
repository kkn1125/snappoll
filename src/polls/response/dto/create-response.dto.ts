import { Answer, Response } from '@prisma/client';

export class CreateResponseDto
  implements Omit<Response, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
{
  userId?: string;
  pollId: string;
  answer?: Answer[];
}
