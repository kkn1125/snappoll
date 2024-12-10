import { SharePoll } from '@prisma/client';

export class CreateSharePollDto implements Pick<SharePoll, 'pollId' | 'url'> {
  pollId: string;
  url: string;
}
