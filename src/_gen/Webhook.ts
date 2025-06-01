import { ApiProperty } from '@nestjs/swagger';

export class Webhook {
  @ApiProperty({ type: Number })
  id!: number;
  @ApiProperty({ type: String })
  domain!: string;
  @ApiProperty({ type: String })
  type!: string;
  @ApiProperty({ type: String })
  webhookUrl!: string;
  @ApiProperty({ type: Boolean })
  active: boolean = true;
  @ApiProperty({ type: Date })
  createdAt!: Date;
  @ApiProperty({ type: Date })
  updatedAt!: Date;
  @ApiProperty({ type: Date })
  deletedAt!: Date | null;
}
