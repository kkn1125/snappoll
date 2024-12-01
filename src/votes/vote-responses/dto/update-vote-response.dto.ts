import { PartialType } from '@nestjs/mapped-types';
import { CreateVoteResponseDto } from './create-vote-response.dto';

export class UpdateVoteResponseDto extends PartialType(CreateVoteResponseDto) {}
