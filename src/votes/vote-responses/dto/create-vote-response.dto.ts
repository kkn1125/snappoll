import { VoteResponse } from '@prisma/client';

export class CreateVoteResponseDto
  implements Omit<VoteResponse, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
{
  userId?: string;
  voteId: string;
  voteOptionId: string;
}
