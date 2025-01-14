import { IgnoreCookie } from '@auth/ignore-cookie.decorator';
import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PlanType, SubscribeType } from '@prisma/client';
import CryptoJS from 'crypto-js';
import { Request } from 'express';
import { firstValueFrom } from 'rxjs';
import { BuillingPrepareDto } from './dto/builling-prepare.dto';
import { BuillingDto } from './dto/builling.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PlansService } from './plans.service';
import SnapLogger from '@utils/SnapLogger';

@Controller('plans')
export class PlansController {
  logger = new SnapLogger(this);
  orderIdManager = new Map<
    string,
    { orderId: string; amount: number; planName: string }
  >();

  constructor(
    private readonly configService: ConfigService,
    private readonly plansService: PlansService,
    private readonly httpService: HttpService,
  ) {}

  // @Post()
  // create(@Body() createPlanDto: CreatePlanDto) {
  //   return this.plansService.create(createPlanDto);
  // }

  @IgnoreCookie()
  @Get('view')
  findAllView(@Query('page') page: number = 1) {
    return this.plansService.findAllView(page);
  }

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

  @Post('subscribe/prepare')
  prepareSubscribe(
    @Req() req: Request,
    @Body('amount') amount: number,
    @Body('planName') planName: string,
  ) {
    const user = req.user;
    const secret = this.configService.get('common.secretKey');
    const orderId = CryptoJS.HmacSHA256(
      user.id + user.email + planName + amount + Date.now(),
      secret,
    ).toString(CryptoJS.enc.Hex);
    this.orderIdManager.set(user.id, {
      orderId,
      amount,
      planName,
    });
    return orderId;
  }

  @Post('subscribe/builling')
  async builling(
    @Req() req: Request,
    @Body() buillingPrepareDto: BuillingPrepareDto,
  ) {
    const base64Secret = this.plansService.getBase64Secret();
    const result = await firstValueFrom(
      this.httpService.post(
        'https://api.tosspayments.com/v1/billing/authorizations/issue',
        buillingPrepareDto,
        {
          headers: {
            Authorization: 'Basic ' + base64Secret,
            'Content-Type': 'application/json',
          },
        },
      ),
    );
    return result.data;
  }

  @Post('subscribe/builling/confirm')
  async buillingConfirm(@Req() req: Request, @Body() buillingDto: BuillingDto) {
    const base64Secret = this.plansService.getBase64Secret();
    const user = req.user;
    const customerEmail = user.email;
    const customerName = user.username;
    let orderId: string;
    let amount: number;
    let planName: string;

    try {
      const manager = this.orderIdManager.get(user.id);
      orderId = manager.orderId;
      amount = manager.amount;
      planName = manager.planName;
    } catch (error) {
      const errorCode = await this.plansService.prisma.getErrorCode(
        'plan',
        'InvalidPlan',
      );
      throw new BadRequestException(errorCode);
    }

    const { billingKey, customerKey, taxFreeAmount, taxExemptionAmount } =
      buillingDto;
    const { data }: { data: SuccessPayment } = await firstValueFrom(
      this.httpService.post(
        `https://api.tosspayments.com/v1/billing/${billingKey}`,
        {
          amount,
          customerKey,
          orderId,
          orderName: planName,
          customerEmail,
          customerName,
          taxExemptionAmount,
          taxFreeAmount,
        },
        {
          headers: {
            Authorization: 'Basic ' + base64Secret,
            'Content-Type': 'application/json',
          },
        },
      ),
    );
    this.logger.info(data);
    // 사용자가 선택한 플랜
    const plan = await this.plansService.findOneByName(planName);
    this.orderIdManager.delete(user.id);
    return this.plansService.prisma.$transaction(async () => {
      await this.plansService.cancelPaymentByUserId(user.id, 'change plan');
      const subscription = await this.plansService.subscribe(
        user.id,
        plan.planType,
        plan.planType === 'Free'
          ? SubscribeType.Infinite
          : SubscribeType.Monthly,
      );
      await this.plansService.buillingConfirm(
        user.id,
        subscription.id,
        customerKey,
        data,
      );
      return data;
    });
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

  @Post('subscribe/cancel')
  async cancelSubscribe(
    @Req() req: Request,
    @Body('subscriptionId') subscriptionId: string,
  ) {
    const userId = req.user?.id;
    await this.plansService.unsubscribe(subscriptionId);
    return await this.plansService.cancelPayment(userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlanDto: UpdatePlanDto) {
    return this.plansService.update(id, updatePlanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.plansService.remove(id);
  }
}
