import { Injectable } from '@nestjs/common';
import { CreateVoteOptionDto } from './dto/create-vote-option.dto';
import { UpdateVoteOptionDto } from './dto/update-vote-option.dto';

@Injectable()
export class VoteOptionsService {
  create(createVoteOptionDto: CreateVoteOptionDto) {
    return 'This action adds a new voteOption';
  }

  findAll() {
    return `This action returns all voteOptions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} voteOption`;
  }

  update(id: number, updateVoteOptionDto: UpdateVoteOptionDto) {
    return `This action updates a #${id} voteOption`;
  }

  remove(id: number) {
    return `This action removes a #${id} voteOption`;
  }
}
