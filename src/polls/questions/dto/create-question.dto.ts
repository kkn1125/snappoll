import { Question } from '@prisma/client';

export class CreateQuestionDto
  implements
    Omit<Question, 'id' | 'description' | 'order' | 'createdAt' | 'updatedAt'>
{
  pollId: string;
  type: string;
  title: string;
  description?: string;
  order?: number;
  isRequired: boolean;
  isMultiple: boolean;
  useEtc: boolean;
}
