import { ApiProperty } from '@nestjs/swagger';

import { ErrorMessage } from './ErrorMessage';

export class Code {
  @ApiProperty({ type: Number })
  id!: number;
  @ApiProperty({ type: Number })
  status!: number;
  @ApiProperty({ type: String })
  domain!: string;
  @ApiProperty({ isArray: true, type: () => ErrorMessage })
  errorMessage!: ErrorMessage[];
}
