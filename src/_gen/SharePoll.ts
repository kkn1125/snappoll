import { ApiProperty } from '@nestjs/swagger';

import { Poll } from './Poll';

export class SharePoll {
  @ApiProperty({ type: String })
  id!: string;
  @ApiProperty({ type: String })
  pollId!: string;
  @ApiProperty({ type: String })
  url!: string;
  @ApiProperty({ type: Date })
  createdAt!: Date;
  @ApiProperty({ type: Date })
  deletedAt!: Date | null;
  @ApiProperty({ type: () => Poll })
  poll!: Poll;
}
