import { ApiProperty } from '@nestjs/swagger';

import { User } from './User';

export class Message {
  @ApiProperty({ type: String })
  id!: string;
  @ApiProperty({ type: String })
  fromId!: string;
  @ApiProperty({ type: String })
  toId!: string;
  @ApiProperty({ type: String })
  message!: string;
  @ApiProperty({ type: Boolean })
  checked: boolean = false;
  @ApiProperty({ type: Date })
  createdAt!: Date;
  @ApiProperty({ type: () => User })
  sender!: User;
  @ApiProperty({ type: () => User })
  receiver!: User;
}
