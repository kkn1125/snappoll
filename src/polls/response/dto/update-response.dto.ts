import { PartialType } from '@nestjs/mapped-types';

class CustomUpdateDto {
  userId?: string;
  pollId: string;
}
export class UpdateResponseDto extends PartialType(CustomUpdateDto) {}
