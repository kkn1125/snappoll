import { Option, Poll, Question } from '@prisma/client';

export class CreatePollDto
  implements Pick<Poll, 'title' | 'description' | 'userId'>
{
  title: string;
  description: string;
  userId: string;
  expiresAt?: Date;
  question?: SnapQuestion[];
}

export interface SnapQuestion extends Question {
  option?: Option[];
}
