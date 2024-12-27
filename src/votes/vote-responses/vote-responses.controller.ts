import { RoleGuard } from '@auth/role.guard';
import { PlanValidate } from '@middleware/plan-validate.decorator';
import { PlanGuard } from '@middleware/plan.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateVoteResponseDto } from './dto/create-vote-response.dto';
import { UpdateVoteResponseDto } from './dto/update-vote-response.dto';
import { VoteResponsesService } from './vote-responses.service';

@Controller('response')
export class VoteResponsesController {
  constructor(private readonly voteResponsesService: VoteResponsesService) {}

  @PlanValidate('voteResponse')
  @UseGuards(PlanGuard)
  @Post()
  create(
    @Body()
    createVoteResponseDto: CreateVoteResponseDto,
  ) {
    return this.voteResponsesService.create(createVoteResponseDto);
  }

  @UseGuards(RoleGuard)
  @Get()
  findAll() {
    return this.voteResponsesService.findAll();
  }

  @UseGuards(RoleGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.voteResponsesService.findOne(id);
  }

  @UseGuards(RoleGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateVoteResponseDto: UpdateVoteResponseDto,
  ) {
    return this.voteResponsesService.update(id, updateVoteResponseDto);
  }

  @UseGuards(RoleGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.voteResponsesService.remove(id);
  }
}
