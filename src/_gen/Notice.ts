import { ApiProperty } from '@nestjs/swagger';

import { NoticeType } from '@prisma/client';

export class Notice {
  @ApiProperty({ type: String })
  id!: string;
  @ApiProperty({ enum: NoticeType })
  type: NoticeType = 'Normal';
  @ApiProperty({ type: String })
  cover!: string | null;
  @ApiProperty({ type: String })
  title!: string;
  @ApiProperty({ type: String })
  content!: string;
  @ApiProperty({ type: Date })
  createdAt!: Date;
  @ApiProperty({ type: Date })
  updatedAt!: Date;
  @ApiProperty({ type: Date })
  sendAt!: Date | null;
}
