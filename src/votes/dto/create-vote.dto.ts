import { Vote } from '@prisma/client';

export class CreateVoteDto
  implements Omit<Vote, 'id' | 'createdAt' | 'updatedAt'>
{
  title: string;
  description: string;
  userId: string;
  content: string;
  isMultiple: boolean;
}
