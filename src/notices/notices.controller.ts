import { Roles } from '@auth/roles.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { NoticesService } from './notices.service';
import SnapLogger from '@utils/SnapLogger';

@Controller('notices')
export class NoticesController {
  logger = new SnapLogger(this);

  constructor(private readonly noticesService: NoticesService) {}

  @Roles(['Admin'])
  @Post()
  create(@Body() createNoticeDto: CreateNoticeDto) {
    return this.noticesService.create(createNoticeDto);
  }

  @Get()
  findAll(@Query('page') page: number = 1) {
    return this.noticesService.findAll(+page);
  }

  @Roles(['Admin'])
  @Post('publish')
  async sendMail(@Body('id') id: string) {
    const results = await this.noticesService.sendMail(id);
    this.logger.debug('send mail results:', results);
    return {
      sendCount: results.length,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.noticesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNoticeDto: UpdateNoticeDto) {
    return this.noticesService.update(id, updateNoticeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.noticesService.remove(id);
  }
}
