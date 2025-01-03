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
import { Roles } from '@auth/roles.decorator';

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

  @Get()
  findAll(@Query('page') page: number = 1) {
    return this.boardsService.findAll(+page);
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
    @Req() req: Request,
    @Query('only') only: boolean,
    @Param('category') category: string,
    @Param('id') id: string,
  ) {
    const userId = req.user?.id;
    if (!only) {
      return this.boardsService
        .viewCount(category, id)
        .then(() => this.boardsService.findCategoryOne(category, id, userId));
    }
    return this.boardsService.findCategoryOne(category, id, userId);
  }

  // @Throttle({ short: { limit: 5, ttl: 1000 } })
  // @IgnoreCookie()
  // @Put('category/:category/:id/view')
  // viewCountOneOfCategory(
  //   @Param('category') category: string,
  //   @Param('id') id: string,
  // ) {
  //   return this.boardsService.viewCount(category, id);
  // }

  @Throttle({ short: { limit: 5, ttl: 1000 } })
  @Post(':id/like')
  addLike(@Req() req: Request, @Param('id') id: string) {
    const userId = req.user?.id;
    return this.boardsService.addLike(id, userId);
  }

  @Throttle({ short: { limit: 5, ttl: 1000 } })
  @Delete(':id/like')
  removeLike(@Req() req: Request, @Param('id') id: string) {
    const userId = req.user?.id;
    return this.boardsService.removeLike(id, userId);
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

  @Roles(['Admin'])
  @Put(':id')
  removeForce(@Req() req: Request, @Param('id') id: string) {
    return this.boardsService.removeForce(id);
  }
}
