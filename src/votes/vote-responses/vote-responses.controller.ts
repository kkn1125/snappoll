import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { VoteResponsesService } from './vote-responses.service';
import { CreateVoteResponseDto } from './dto/create-vote-response.dto';
import { UpdateVoteResponseDto } from './dto/update-vote-response.dto';

@Controller('vote-responses')
export class VoteResponsesController {
  constructor(private readonly voteResponsesService: VoteResponsesService) {}

  @Post()
  create(@Body() createVoteResponseDto: CreateVoteResponseDto) {
    return this.voteResponsesService.create(createVoteResponseDto);
  }

  @Get()
  findAll() {
    return this.voteResponsesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.voteResponsesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateVoteResponseDto: UpdateVoteResponseDto,
  ) {
    return this.voteResponsesService.update(+id, updateVoteResponseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.voteResponsesService.remove(+id);
  }
}
