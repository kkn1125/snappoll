import { PartialType } from '@nestjs/mapped-types';

class CustomUpdateDto {
  title: string;
  description: string;
  userId: string;
  expiresAt: Date;
}
export class UpdatePollDto extends PartialType(CustomUpdateDto) {}
