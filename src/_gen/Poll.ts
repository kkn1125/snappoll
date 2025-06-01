import { ApiProperty } from '@nestjs/swagger';

import { User } from './User';
import { Question } from './Question';
import { Response } from './Response';
import { SharePoll } from './SharePoll';

export class Poll {
  @ApiProperty({ type: String })
  id!: string;
  @ApiProperty({ type: String })
  title!: string;
  @ApiProperty({ type: String })
  description!: string | null;
  @ApiProperty({ type: String })
  userId!: string;
  @ApiProperty({ type: Date })
  expiresAt!: Date | null;
  @ApiProperty({ type: Date })
  createdAt!: Date;
  @ApiProperty({ type: Date })
  updatedAt!: Date;
  @ApiProperty({ type: () => User })
  user!: User;
  @ApiProperty({ isArray: true, type: () => Question })
  question!: Question[];
  @ApiProperty({ isArray: true, type: () => Response })
  response!: Response[];
  @ApiProperty({ type: () => SharePoll })
  sharePoll!: SharePoll | null;
}
