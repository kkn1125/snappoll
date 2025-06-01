import { ApiProperty } from '@nestjs/swagger';

import { SubscribeType, State } from '@prisma/client';

import { User } from './User';
import { Plan } from './Plan';
import { Payment } from './Payment';

export class Subscription {
  @ApiProperty({ type: String })
  id!: string;
  @ApiProperty({ type: String })
  userId!: string;
  @ApiProperty({ type: String })
  planId!: string;
  @ApiProperty({ enum: SubscribeType })
  type!: SubscribeType;
  @ApiProperty({ enum: State })
  state: State = 'Active';
  @ApiProperty({ type: Date })
  startDate!: Date;
  @ApiProperty({ type: Date })
  endDate!: Date | null;
  @ApiProperty({ type: () => User })
  user!: User;
  @ApiProperty({ type: () => Plan })
  plan!: Plan;
  @ApiProperty({ isArray: true, type: () => Payment })
  payment!: Payment[];
}
