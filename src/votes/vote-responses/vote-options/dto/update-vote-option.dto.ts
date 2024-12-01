import { PartialType } from '@nestjs/mapped-types';
import { CreateVoteOptionDto } from './create-vote-option.dto';

export class UpdateVoteOptionDto extends PartialType(CreateVoteOptionDto) {}
