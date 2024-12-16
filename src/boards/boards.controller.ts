import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { IgnoreCookie } from '@auth/ignore-cookie.decorator';
import { CookieGuard } from '@auth/cookie.guard';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  create(@Body() createBoardDto: CreateBoardDto) {
    return this.boardsService.create(createBoardDto);
  }

  @IgnoreCookie()
  @Get()
  findAll() {
    return this.boardsService.findAll();
  }

  // @IgnoreCookie()
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.boardsService.findOne(id);
  // }

  @IgnoreCookie()
  @Get('category/:category')
  findCategory(@Param('category') category: string) {
    return this.boardsService.findCategory(category);
  }

  @IgnoreCookie()
  @Get('category/:category/:id')
  findOneOfCategory(
    @Param('category') category: string,
    @Param('id') id: string,
  ) {
    return this.boardsService.findCategoryOne(category, id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBoardDto: UpdateBoardDto) {
    return this.boardsService.update(id, updateBoardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boardsService.remove(id);
  }
}
