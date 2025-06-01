import { ApiProperty } from '@nestjs/swagger';

import { VoteResponse } from './VoteResponse';
import { VoteOption } from './VoteOption';

export class VoteAnswer {
  @ApiProperty({ type: String })
  id!: string;
  @ApiProperty({ type: String })
  voteResponseId!: string | null;
  @ApiProperty({ type: String })
  voteOptionId!: string | null;
  @ApiProperty({ type: String })
  value!: string | null;
  @ApiProperty({ type: Date })
  createdAt!: Date;
  @ApiProperty({ type: Date })
  updatedAt!: Date;
  @ApiProperty({ type: () => VoteResponse })
  voteResponse!: VoteResponse | null;
  @ApiProperty({ type: () => VoteOption })
  voteOption!: VoteOption | null;
}
