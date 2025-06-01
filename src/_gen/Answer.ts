import { ApiProperty } from '@nestjs/swagger';

import { Response } from './Response';
import { Question } from './Question';
import { Option } from './Option';

export class Answer {
  @ApiProperty({ type: String })
  id!: string;
  @ApiProperty({ type: String })
  responseId!: string | null;
  @ApiProperty({ type: String })
  questionId!: string;
  @ApiProperty({ type: String })
  optionId!: string | null;
  @ApiProperty({ type: String })
  value!: string | null;
  @ApiProperty({ type: Date })
  createdAt!: Date;
  @ApiProperty({ type: Date })
  updatedAt!: Date;
  @ApiProperty({ type: () => Response })
  response!: Response | null;
  @ApiProperty({ type: () => Question })
  question!: Question;
  @ApiProperty({ type: () => Option })
  option!: Option | null;
}
