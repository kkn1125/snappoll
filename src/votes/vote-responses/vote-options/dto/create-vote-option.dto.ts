import { VoteOption } from '@prisma/client';

export class CreateVoteOptionDto
  implements Omit<VoteOption, 'id' | 'createdAt' | 'updatedAt'>
{
  voteId: string;
  content: string;
  order: number | null;
}
