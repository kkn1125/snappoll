import { PartialType } from '@nestjs/mapped-types';
import { Answer, Option, Question } from '@prisma/client';

class CustomUpdateDto {
  title: string;
  description: string;
  userId: string;
  expiresAt: Date;
}
export class UpdatePollDto extends PartialType(CustomUpdateDto) {
  question: SnapQuestion[];
}

interface SnapQuestion extends Question {
  option: Option[];
  answer: Answer[];
}
