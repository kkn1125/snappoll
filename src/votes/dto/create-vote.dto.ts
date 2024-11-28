import { Vote } from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library';

export class CreateVoteDto
  implements Omit<Vote, 'id' | 'createdAt' | 'updatedAt' | 'pollId'>
{
  title: string;
  userId: string;
  pollId?: string;
  content: string;
  options: JsonValue;
}
