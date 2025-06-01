import { ApiProperty } from '@nestjs/swagger';

import { User } from './User';
import { VoteOption } from './VoteOption';
import { VoteResponse } from './VoteResponse';
import { ShareVote } from './ShareVote';

export class Vote {
  @ApiProperty({ type: String })
  id!: string;
  @ApiProperty({ type: String })
  userId!: string;
  @ApiProperty({ type: String })
  title!: string;
  @ApiProperty({ type: String })
  description!: string;
  @ApiProperty({ type: Boolean })
  isMultiple!: boolean;
  @ApiProperty({ type: Boolean })
  useEtc: boolean = false;
  @ApiProperty({ type: Date })
  expiresAt!: Date | null;
  @ApiProperty({ type: Date })
  createdAt!: Date;
  @ApiProperty({ type: Date })
  updatedAt!: Date;
  @ApiProperty({ type: () => User })
  user!: User;
  @ApiProperty({ isArray: true, type: () => VoteOption })
  voteOption!: VoteOption[];
  @ApiProperty({ isArray: true, type: () => VoteResponse })
  voteResponse!: VoteResponse[];
  @ApiProperty({ type: () => ShareVote })
  shareVote!: ShareVote | null;
}
