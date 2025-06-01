import { ApiProperty } from '@nestjs/swagger';

import { User } from './User';
import { Vote } from './Vote';
import { VoteAnswer } from './VoteAnswer';

export class VoteResponse {
  @ApiProperty({ type: String })
  id!: string;
  @ApiProperty({ type: String })
  userId!: string | null;
  @ApiProperty({ type: String })
  voteId!: string;
  @ApiProperty({ type: Date })
  createdAt!: Date;
  @ApiProperty({ type: Date })
  updatedAt!: Date;
  @ApiProperty({ type: () => User })
  user!: User | null;
  @ApiProperty({ type: () => Vote })
  vote!: Vote;
  @ApiProperty({ isArray: true, type: () => VoteAnswer })
  voteAnswer!: VoteAnswer[];
}
