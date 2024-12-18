import { IgnoreCookie } from '@auth/ignore-cookie.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Request } from 'express';
import { Throttle } from '@nestjs/throttler';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @IgnoreCookie()
  @Post(':id/validate')
  validatePassword(
    @Req() req: Request,
    @Param('id') id: string,
    @Body('password') password: string,
  ) {
    const isUser = !!req.user;
    return this.boardsService.validatePassword(id, password, isUser);
  }

  @IgnoreCookie()
  @Post()
  create(@Req() req: Request, @Body() createBoardDto: CreateBoardDto) {
    const isUser = !!req.user;
    return this.boardsService.create(createBoardDto, isUser);
  }

  @IgnoreCookie()
  @Get()
  findAll() {
    return this.boardsService.findAll();
  }

  @Throttle({ short: { limit: 5, ttl: 1000 } })
  @IgnoreCookie()
  @Get('categories')
  findAllCategories(@Query('eachAmount') eachAmount: number = 5) {
    return this.boardsService.findAllCategories(+eachAmount);
  }

  @Throttle({ short: { limit: 5, ttl: 1000 } })
  @IgnoreCookie()
  @Get('category/:category')
  findCategory(
    @Query('page') page: number,
    @Param('category') category: string,
  ) {
    return this.boardsService.findCategory(category, page);
  }

  @Throttle({ short: { limit: 5, ttl: 1000 } })
  @IgnoreCookie()
  @Get('category/:category/:id')
  findOneOfCategory(
    @Param('category') category: string,
    @Param('id') id: string,
  ) {
    return this.boardsService.findCategoryOne(category, id);
  }

  @IgnoreCookie()
  @Patch(':id')
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateBoardDto: UpdateBoardDto,
  ) {
    const isUser = !!req.user;
    return this.boardsService.update(id, updateBoardDto, isUser);
  }

  @IgnoreCookie()
  @Put(':id')
  remove(
    @Req() req: Request,
    @Param('id') id: string,
    @Body('password') password: string,
  ) {
    const isUser = !!req.user;
    return this.boardsService.remove(id, password, isUser);
  }
}
