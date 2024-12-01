import { PartialType } from '@nestjs/mapped-types';

class CustomUpdateDto {
  title: string;
  description: string;
  createdBy: string;
  expiresAt: Date;
}
export class UpdatePollDto extends PartialType(CustomUpdateDto) {}
