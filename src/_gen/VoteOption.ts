import { ApiProperty } from '@nestjs/swagger';

import { Vote } from './Vote';
import { VoteAnswer } from './VoteAnswer';

export class VoteOption {
  @ApiProperty({ type: String })
  id!: string;
  @ApiProperty({ type: String })
  voteId!: string;
  @ApiProperty({ type: String })
  content!: string;
  @ApiProperty({ type: Number })
  order!: number | null;
  @ApiProperty({ type: Date })
  createdAt!: Date;
  @ApiProperty({ type: Date })
  updatedAt!: Date;
  @ApiProperty({ type: () => Vote })
  vote!: Vote;
  @ApiProperty({ isArray: true, type: () => VoteAnswer })
  voteAnswer!: VoteAnswer[];
}
