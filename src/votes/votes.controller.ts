import { RoleGuard } from '@/auth/role.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { VotesService } from './votes.service';

@UseGuards(RoleGuard)
@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Post()
  create(@Body() createVoteDto: CreateVoteDto) {
    return this.votesService.create(createVoteDto);
  }

  @Get()
  findAll(@Query('page') page: number = 1) {
    return this.votesService.findAll(page);
  }

  @Get('me')
  findMe(@Req() req: Request, @Query('page') page: number = 1) {
    const { id } = req.user;
    return this.votesService.findMe(id, page);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.votesService.findOne(id);
  }

  // @Get(':id/response')
  // findOneResponse(@Param('id') id: string) {
  //   return this.votesService.findResponse(id);
  // }

  @Get('me/response')
  findOneResponsesMe(@Req() req: Request, @Query('page') page: number = 1) {
    const id = req.user.id;
    return this.votesService.findResponsesMe(id, page);
  }

  @Get(':id/response')
  findOneResponses(@Param('id') id: string, @Query('page') page: number = 1) {
    return this.votesService.findResponses(id, page);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateVoteDto: UpdateVoteDto) {
    return this.votesService.update(id, updateVoteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.votesService.remove(id);
  }
}
