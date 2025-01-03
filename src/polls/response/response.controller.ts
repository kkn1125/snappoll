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
import { CreateResponseDto } from './dto/create-response.dto';
import { UpdateResponseDto } from './dto/update-response.dto';
import { ResponseService } from './response.service';
import { RoleGuard } from '@auth/role.guard';
import { PlanValidate } from '@middleware/plan-validate.decorator';

@UseGuards(RoleGuard)
@Controller('response')
export class ResponseController {
  constructor(private readonly responseService: ResponseService) {}

  @PlanValidate('pollResponse')
  @Post()
  create(@Body() createResponseDto: CreateResponseDto) {
    return this.responseService.create(createResponseDto);
  }

  @Get()
  findAll() {
    return this.responseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.responseService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateResponseDto: UpdateResponseDto,
  ) {
    return this.responseService.update(id, updateResponseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.responseService.remove(id);
  }
}
