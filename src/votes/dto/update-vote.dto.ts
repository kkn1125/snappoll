import { PartialType } from '@nestjs/mapped-types';

class CustomUpdateDto {
  title: string;
  description: string;
  userId: string;
  isMultiple: boolean;
  expiresAt?: Date;
}
export class UpdateVoteDto extends PartialType(CustomUpdateDto) {}
