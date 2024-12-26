import { PrismaService } from '@database/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PlanType, State, SubscribeType } from '@prisma/client';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { SubscriptionPlanDto } from './dto/subscription-plan.dto';

@Injectable()
export class PlansService {
  constructor(private readonly prisma: PrismaService) {}

  // create(createPlanDto: CreatePlanDto) {
  //   return 'This action adds a new plan';
  // }

  async findAll() {
    const plans = await this.prisma.plan.findMany({
      include: {
        subscription: true,
        feature: true,
      },
    });
    const subscribers = await this.prisma.subscription.count({
      where: { endDate: null },
    });
    return { plans, subscribers };
  }

  findOne(id: string) {}

  async subscribe(userId: string, planType: PlanType, type: SubscribeType) {
    const plan = await this.prisma.plan.findUnique({ where: { planType } });
    if (!plan) {
      const errorCode = await this.prisma.getErrorCode('plan', 'NotFound');
      throw new NotFoundException(errorCode);
    }

    const subscribedList = await this.prisma.subscription.findMany({
      where: {
        userId,
        endDate: null,
      },
    });

    if (subscribedList.some((sub) => sub.planId === plan.id)) {
      // update
      const subscribed = subscribedList.find((sub) => sub.planId === plan.id);
      return this.prisma.subscription.update({
        where: { id: subscribed.id },
        data: {
          type,
        },
      });
    } else {
      // create
      return this.prisma.subscription.create({
        data: {
          type,
          planId: plan.id,
          userId,
        },
      });
    }
  }

  async unsubscribe(subscriptionId: string) {
    return await this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        state: State.Cancelled,
        endDate: new Date(),
      },
    });
  }

  update(id: string, updatePlanDto: UpdatePlanDto) {}

  // remove(id: string) {
  //   return `This action removes a #${id} plan`;
  // }
}
