import { PartialType } from '@nestjs/mapped-types';

class CustomUpdateDto {
  userId?: string;
  voteId: string;
  voteOptionId?: string;
  value?: string;
}
export class UpdateVoteResponseDto extends PartialType(CustomUpdateDto) {}
