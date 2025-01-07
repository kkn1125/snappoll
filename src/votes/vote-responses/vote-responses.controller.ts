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
import { IgnoreCookie } from '@auth/ignore-cookie.decorator';

@UseGuards(RoleGuard)
@Controller('response')
export class VoteResponsesController {
  constructor(private readonly voteResponsesService: VoteResponsesService) {}

  @IgnoreCookie()
  @PlanValidate('voteResponse')
  @UseGuards(PlanGuard)
  @Post()
  create(
    @Body()
    createVoteResponseDto: CreateVoteResponseDto,
  ) {
    return this.voteResponsesService.create(createVoteResponseDto);
  }

  @Get()
  findAll() {
    return this.voteResponsesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.voteResponsesService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateVoteResponseDto: UpdateVoteResponseDto,
  ) {
    return this.voteResponsesService.update(id, updateVoteResponseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.voteResponsesService.remove(id);
  }
}
