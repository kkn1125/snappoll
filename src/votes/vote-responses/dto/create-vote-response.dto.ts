import { VoteAnswer, VoteResponse } from '@prisma/client';

export class CreateVoteResponseDto implements Pick<VoteResponse, 'voteId'> {
  userId?: string;
  voteId: string;
  voteOptionId?: string;
  value?: string;
  voteAnswer?: VoteAnswer[];
}
