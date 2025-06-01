import { ApiProperty } from '@nestjs/swagger';

import { Poll } from './Poll';
import { Answer } from './Answer';
import { Option } from './Option';

export class Question {
  @ApiProperty({ type: String })
  id!: string;
  @ApiProperty({ type: String })
  pollId!: string;
  @ApiProperty({ type: String })
  type: string = 'input';
  @ApiProperty({ type: String })
  title!: string;
  @ApiProperty({ type: String })
  description!: string | null;
  @ApiProperty({ type: Number })
  order!: number | null;
  @ApiProperty({ type: Boolean })
  isRequired: boolean = false;
  @ApiProperty({ type: Boolean })
  isMultiple: boolean = false;
  @ApiProperty({ type: Boolean })
  useEtc: boolean = false;
  @ApiProperty({ type: Date })
  createdAt!: Date;
  @ApiProperty({ type: Date })
  updatedAt!: Date;
  @ApiProperty({ type: () => Poll })
  poll!: Poll;
  @ApiProperty({ isArray: true, type: () => Answer })
  answer!: Answer[];
  @ApiProperty({ isArray: true, type: () => Option })
  option!: Option[];
}
