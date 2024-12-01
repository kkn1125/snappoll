import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { VoteOptionsService } from './vote-options.service';
import { CreateVoteOptionDto } from './dto/create-vote-option.dto';
import { UpdateVoteOptionDto } from './dto/update-vote-option.dto';

@Controller('vote-options')
export class VoteOptionsController {
  constructor(private readonly voteOptionsService: VoteOptionsService) {}

  @Post()
  create(@Body() createVoteOptionDto: CreateVoteOptionDto) {
    return this.voteOptionsService.create(createVoteOptionDto);
  }

  @Get()
  findAll() {
    return this.voteOptionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.voteOptionsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateVoteOptionDto: UpdateVoteOptionDto,
  ) {
    return this.voteOptionsService.update(+id, updateVoteOptionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.voteOptionsService.remove(+id);
  }
}
