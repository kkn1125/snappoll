import { Option } from '@prisma/client';

export class CreateOptionDto implements Option {
  id: string;
  questionId: string;
  content: string;
}
