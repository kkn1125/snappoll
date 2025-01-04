import { PartialType } from '@nestjs/mapped-types';
import { VoteAnswer, VoteOption } from '@prisma/client';

class CustomUpdateDto {
  title: string;
  description: string;
  userId: string;
  isMultiple: boolean;
  useEtc: boolean;
  expiresAt?: Date;
}
export class UpdateVoteDto extends PartialType(CustomUpdateDto) {
  voteOption: SnapVoteOption[];
}

interface SnapVoteOption extends VoteOption {
  voteAnswer: VoteAnswer[];
}
