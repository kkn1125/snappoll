import { ApiProperty } from '@nestjs/swagger';

import { Terms } from './Terms';

export class TermsSection {
  @ApiProperty({ type: String })
  id!: string;
  @ApiProperty({ type: String })
  termsId!: string;
  @ApiProperty({ type: String })
  title!: string;
  @ApiProperty({ type: String })
  content!: string;
  @ApiProperty({ type: Date })
  createdAt!: Date;
  @ApiProperty({ type: Date })
  updatedAt!: Date;
  @ApiProperty({ type: () => Terms })
  terms!: Terms;
}
