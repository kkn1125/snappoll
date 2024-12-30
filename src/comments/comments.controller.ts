import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { IgnoreCookie } from '@auth/ignore-cookie.decorator';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('board/:id')
  create(@Param('id') id: string, @Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(id, createCommentDto);
  }

  // @Get()
  // findAll() {
  //   return this.commentsService.findAll();
  // }

  @IgnoreCookie()
  @Get('board/:id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findByBoardId(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(+id, updateCommentDto);
  }

  @Put('revoke/:id')
  revokeComment(@Param('id') id: number) {
    return this.commentsService.revoke(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.commentsService.remove(+id);
  }

  @Delete('force/:id')
  removeForce(@Param('id') id: number) {
    return this.commentsService.removeForce(+id);
  }
}
