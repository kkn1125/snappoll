import { ApiProperty } from '@nestjs/swagger';

import { Question } from './Question';
import { Answer } from './Answer';

export class Option {
  @ApiProperty({ type: String })
  id!: string;
  @ApiProperty({ type: String })
  questionId!: string;
  @ApiProperty({ type: String })
  content!: string;
  @ApiProperty({ type: Number })
  order!: number | null;
  @ApiProperty({ type: () => Question })
  question!: Question;
  @ApiProperty({ isArray: true, type: () => Answer })
  answer!: Answer[];
}
