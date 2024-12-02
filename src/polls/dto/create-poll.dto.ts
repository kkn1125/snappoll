import { Poll, Question } from '@prisma/client';

export class CreatePollDto
  implements Pick<Poll, 'title' | 'description' | 'createdBy'>
{
  title: string;
  description: string;
  createdBy: string;
  expiresAt?: Date;
  question?: Question[];
}
