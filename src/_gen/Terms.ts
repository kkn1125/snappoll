import { ApiProperty } from '@nestjs/swagger';

import { TermsSection } from './TermsSection';
import { AllowTerms } from './AllowTerms';

export class Terms {
  @ApiProperty({ type: String })
  id!: string;
  @ApiProperty({ type: String })
  version!: string;
  @ApiProperty({ type: Boolean })
  isActive: boolean = true;
  @ApiProperty({ type: Date })
  createdAt!: Date;
  @ApiProperty({ type: Date })
  updatedAt!: Date;
  @ApiProperty({ isArray: true, type: () => TermsSection })
  termsSection!: TermsSection[];
  @ApiProperty({ isArray: true, type: () => AllowTerms })
  allowTerms!: AllowTerms[];
}
