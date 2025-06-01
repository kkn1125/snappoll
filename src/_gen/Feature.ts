import { ApiProperty } from '@nestjs/swagger';

import { Plan } from './Plan';

export class Feature {
  @ApiProperty({ type: String })
  id!: string;
  @ApiProperty({ type: String })
  planId!: string;
  @ApiProperty({ type: String })
  feature!: string;
  @ApiProperty({ type: Date })
  createdAt!: Date;
  @ApiProperty({ type: Date })
  updatedAt!: Date;
  @ApiProperty({ type: () => Plan })
  plan!: Plan;
}
