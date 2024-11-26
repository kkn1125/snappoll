import { PollResult } from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library';

export class CreateResultDto
  implements Omit<PollResult, 'id' | 'createdAt' | 'updatedAt'>
{
  userId: string;
  pollId: string;
  answer: JsonValue;
  isCrew?: boolean;
}
