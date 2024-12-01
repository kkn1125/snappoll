import { Answer } from '@prisma/client';

export class CreateAnswerDto
  implements Omit<Answer, 'id' | 'optionId' | 'value'>
{
  responseId: string;
  questionId: string;
  optionId?: string;
  value?: string;
}
