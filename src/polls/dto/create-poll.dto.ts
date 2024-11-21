import { Poll } from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library';

export class CreatePollDto
  implements
    Pick<Poll, 'title' | 'description' | 'options' | 'createdBy' | 'expiresAt'>
{
  title: string;
  description: string;
  options: JsonValue;
  createdBy: string;
  expiresAt: Date;
}
