import { Vote, VoteOption } from '@prisma/client';

export class CreateVoteDto
  implements Omit<Vote, 'id' | 'expiresAt' | 'createdAt' | 'updatedAt'>
{
  title: string;
  description: string;
  userId: string;
  isMultiple: boolean;
  useEtc: boolean;
  expiresAt?: Date;
  voteOption?: VoteOption[];
}
