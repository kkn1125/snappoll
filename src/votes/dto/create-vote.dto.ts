import { Vote } from '@prisma/client';

export class CreateVoteDto implements Pick<Vote, 'pollId' | 'userId'> {
  userId: string;
  pollId: string;
}
