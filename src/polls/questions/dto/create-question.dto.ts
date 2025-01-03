import { Question } from '@prisma/client';

export class CreateQuestionDto
  implements Omit<Question, 'id' | 'description' | 'createdAt' | 'updatedAt'>
{
  pollId: string;
  type: string;
  title: string;
  description?: string;
  order: number | null;
  isRequired: boolean;
  isMultiple: boolean;
  useEtc: boolean;
}
