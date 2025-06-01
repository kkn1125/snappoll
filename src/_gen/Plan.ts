import { ApiProperty } from '@nestjs/swagger';

import { PlanType } from '@prisma/client';

import { Subscription } from './Subscription';
import { Feature } from './Feature';

export class Plan {
  @ApiProperty({ type: String })
  id!: string;
  @ApiProperty({ enum: PlanType })
  planType: PlanType = 'Free';
  @ApiProperty({ type: String })
  name!: string;
  @ApiProperty({ type: String })
  description!: string | null;
  @ApiProperty({ type: Number })
  price!: number;
  @ApiProperty({ type: Number })
  discount: number = 0;
  @ApiProperty({ type: Date })
  createdAt!: Date;
  @ApiProperty({ type: Date })
  updatedAt!: Date;
  @ApiProperty({ isArray: true, type: () => Subscription })
  subscription!: Subscription[];
  @ApiProperty({ isArray: true, type: () => Feature })
  feature!: Feature[];
}
