import { Injectable } from '@nestjs/common';
import { CreateVoteResponseDto } from './dto/create-vote-response.dto';
import { UpdateVoteResponseDto } from './dto/update-vote-response.dto';

@Injectable()
export class VoteResponsesService {
  create(createVoteResponseDto: CreateVoteResponseDto) {
    return 'This action adds a new voteResponse';
  }

  findAll() {
    return `This action returns all voteResponses`;
  }

  findOne(id: number) {
    return `This action returns a #${id} voteResponse`;
  }

  update(id: number, updateVoteResponseDto: UpdateVoteResponseDto) {
    return `This action updates a #${id} voteResponse`;
  }

  remove(id: number) {
    return `This action removes a #${id} voteResponse`;
  }
}
