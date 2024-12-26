import { IgnoreCookie } from '@auth/ignore-cookie.decorator';
import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PlansService } from './plans.service';
import { SubscriptionPlanDto } from './dto/subscription-plan.dto';
import { PlanType, SubscribeType } from '@prisma/client';
import { Request } from 'express';

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

  @Post('subscribe/:planType')
  subscribe(
    @Req() req: Request,
    @Param('planType') planType: PlanType,
    @Body('type') type: SubscribeType,
  ) {
    const userId = req.user.id;
    return this.plansService.subscribe(userId, planType, type);
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
