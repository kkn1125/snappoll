import { PrismaService } from '@database/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PlanType, State, SubscribeType } from '@prisma/client';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { SubscriptionPlanDto } from './dto/subscription-plan.dto';
import { snakeToCamel } from '@utils/snakeToCamel';

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
      orderBy: { price: 'asc' },
    });
    const subscribers = await this.prisma.subscription.count({
      where: { endDate: null },
    });
    return { plans, subscribers };
  }

  async findAllView(page: number = 1) {
    const plans = await this.prisma.plan.findMany({
      take: 10,
      skip: (page - 1) * 10,
      include: {
        subscription: true,
        feature: true,
        _count: {
          select: { feature: true, subscription: true },
        },
      },
      orderBy: { price: 'asc' },
    });
    const columnList = (await this.prisma
      .$queryRaw`SELECT COLUMN_NAME column FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'plan' ORDER BY ORDINAL_POSITION`) as {
      column: string;
    }[];
    const columns = columnList.map(({ column }) => snakeToCamel(column));
    const count = await this.prisma.plan.count();
    return { plans, columns, count };
  }

  findOne(id: string) {
    return this.prisma.plan.findUnique({
      where: { id },
      include: {
        subscription: true,
        feature: true,
        _count: {
          select: { feature: true, subscription: true },
        },
      },
    });
  }

  async subscribe(userId: string, planType: PlanType, type: SubscribeType) {
    return this.prisma.$transaction(async () => {
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
    });
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

  async update(id: string, updatePlanDto: UpdatePlanDto) {
    return this.prisma.$transaction(async () => {
      const { subscription, feature, _count, ...updateDto } = updatePlanDto;

      await this.prisma.feature.deleteMany({
        where: {
          planId: id,
          id: { notIn: feature.map((feature) => feature.id) },
        },
      });

      for (const feat of feature) {
        await this.prisma.feature.upsert({
          where: { id: feat.id },
          update: feat,
          create: feat,
        });
      }

      return this.prisma.plan.update({
        where: { id },
        data: updateDto,
      });
    });
  }

  remove(id: string) {
    return this.prisma.plan.delete({ where: { id } });
  }
}
