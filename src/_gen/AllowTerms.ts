import { ApiProperty } from '@nestjs/swagger';

import { User } from './User';
import { Terms } from './Terms';

export class AllowTerms {
  @ApiProperty({ type: String })
  id!: string;
  @ApiProperty({ type: String })
  termsId!: string;
  @ApiProperty({ type: String })
  userId!: string;
  @ApiProperty({ type: Date })
  createdAt!: Date;
  @ApiProperty({ type: () => User })
  user!: User;
  @ApiProperty({ type: () => Terms })
  terms!: Terms;
}
