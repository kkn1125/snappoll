import { ApiProperty } from '@nestjs/swagger';

import { Vote } from './Vote';

export class ShareVote {
  @ApiProperty({ type: String })
  id!: string;
  @ApiProperty({ type: String })
  voteId!: string;
  @ApiProperty({ type: String })
  url!: string;
  @ApiProperty({ type: Date })
  createdAt!: Date;
  @ApiProperty({ type: Date })
  deletedAt!: Date | null;
  @ApiProperty({ type: () => Vote })
  vote!: Vote;
}
