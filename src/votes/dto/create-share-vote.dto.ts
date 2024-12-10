import { ShareVote } from '@prisma/client';

export class CreateShareVoteDto implements Pick<ShareVote, 'voteId' | 'url'> {
  voteId: string;
  url: string;
}
