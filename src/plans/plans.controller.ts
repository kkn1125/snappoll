import { IgnoreCookie } from '@auth/ignore-cookie.decorator';
import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PlansService } from './plans.service';

@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  // @Post()
  // create(@Body() createPlanDto: CreatePlanDto) {
  //   return this.plansService.create(createPlanDto);
  // }

  @IgnoreCookie()
  @Get()
  findAll() {
    return this.plansService.findAll();
  }

  @IgnoreCookie()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.plansService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlanDto: UpdatePlanDto) {
    return this.plansService.update(id, updatePlanDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.plansService.remove(+id);
  // }
}
