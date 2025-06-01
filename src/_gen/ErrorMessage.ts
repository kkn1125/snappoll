import { ApiProperty } from '@nestjs/swagger';

import { Code } from './Code';

export class ErrorMessage {
  @ApiProperty({ type: Number })
  id!: number;
  @ApiProperty({ type: String })
  codeDomain!: string;
  @ApiProperty({ type: Number })
  status!: number;
  @ApiProperty({ type: String })
  message!: string;
  @ApiProperty({ type: () => Code })
  code!: Code;
}
