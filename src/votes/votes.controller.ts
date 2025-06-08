import { RoleGuard } from '@/auth/role.guard';
import { IgnoreCookie } from '@auth/ignore-cookie.decorator';
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
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CreateShareVoteDto } from './dto/create-share-vote.dto';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { VotesService } from './votes.service';

@ApiTags('투표')
@UseGuards(RoleGuard)
@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @PlanValidate('voteCreate')
  @UseGuards(PlanGuard)
  @Post()
  create(@Body() createVoteDto: CreateVoteDto) {
    return this.votesService.create(createVoteDto);
  }

  @Get('results')
  getMyResults(@Req() req: Request) {
    return this.votesService.getMyResults(req.user.id);
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

  @Get('graph/:id')
  getGraphData(@Req() req: Request, @Param('id') id: string) {
    const { id: userId } = req.user;
    return this.votesService.getGraphData(id, userId);
  }

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

  @IgnoreCookie()
  @Get('share/:id')
  getShareVoteBy(@Param('id') id: string) {
    return this.votesService.findShareOneById(id);
  }

  @IgnoreCookie()
  @Get('share/url/:url')
  getShareVote(@Param('url') url: string) {
    return this.votesService.findShareOne(url);
  }

  @Post('share')
  createShareUrl(@Body() createShareVoteDto: CreateShareVoteDto) {
    return this.votesService.createShareUrl(createShareVoteDto);
  }

  @Delete('share/:id')
  revokeShareUrl(@Param('id') id: string) {
    return this.votesService.revokeShareUrl(id);
  }

  @Put('share/:id')
  resumeShareUrl(@Param('id') id: string) {
    return this.votesService.resumeShareUrl(id);
  }
}
