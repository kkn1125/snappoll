import { IgnoreCookie } from '@auth/ignore-cookie.decorator';
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
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { CreatePollDto } from './dto/create-poll.dto';
import { CreateSharePollDto } from './dto/create-share-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { PollsService } from './polls.service';

@UseGuards(RoleGuard)
@Controller('polls')
export class PollsController {
  constructor(private readonly pollsService: PollsService) {}

  @PlanValidate('pollCreate')
  @UseGuards(PlanGuard)
  @Post()
  create(@Req() req: Request, @Body() createPollDto: CreatePollDto) {
    createPollDto.userId = req.user.id;
    return this.pollsService.create(createPollDto);
  }

  @Get('results')
  getMyResults(@Req() req: Request) {
    return this.pollsService.getMyResults(req.user.id);
  }

  @Get()
  findAll(@Query('page') page: number = 1) {
    return this.pollsService.findAll(page);
  }

  @Get('me')
  findMe(@Req() req: Request, @Query('page') page: number = 1) {
    const { id } = req.user;
    return this.pollsService.findMe(id, page);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pollsService.findOne(id);
  }

  @Get('me/response')
  findOneResponsesMe(@Req() req: Request, @Query('page') page: number = 1) {
    const id = req.user.id;
    return this.pollsService.findResponsesMe(id, page);
  }

  @Get(':id/response')
  findOneResponses(@Param('id') id: string, @Query('page') page: number = 1) {
    return this.pollsService.findResponses(id, page);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePollDto: UpdatePollDto) {
    return this.pollsService.update(id, updatePollDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pollsService.remove(id);
  }

  @IgnoreCookie()
  @Get('share/:id')
  getSharePollBy(@Param('id') id: string) {
    return this.pollsService.findShareOneById(id);
  }

  @IgnoreCookie()
  @Get('share/url/:url')
  getSharePoll(@Param('url') url: string) {
    return this.pollsService.findShareOne(url);
  }

  @Post('share')
  createShareUrl(@Body() createSharePollDto: CreateSharePollDto) {
    return this.pollsService.createShareUrl(createSharePollDto);
  }

  @Delete('share/:id')
  revokeShareUrl(@Param('id') id: string) {
    return this.pollsService.revokeShareUrl(id);
  }

  @Put('share/:id')
  resumeShareUrl(@Param('id') id: string) {
    return this.pollsService.resumeShareUrl(id);
  }
}
