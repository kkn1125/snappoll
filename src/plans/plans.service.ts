import { PrismaService } from '@database/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Payment, PlanType, State, SubscribeType } from '@prisma/client';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { SubscriptionPlanDto } from './dto/subscription-plan.dto';
import { snakeToCamel } from '@utils/snakeToCamel';
import SnapLogger from '@utils/SnapLogger';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PlansService {
  logger = new SnapLogger(this);

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    public readonly prisma: PrismaService,
  ) {}

  // create(createPlanDto: CreatePlanDto) {
  //   return 'This action adds a new plan';
  // }

  getBase64Secret() {
    const tossSecret = this.configService.get('common.tossSecret');
    return Buffer.from(tossSecret + ':').toString('base64');
  }

  async findOneByName(planName: string) {
    const plan = await this.prisma.plan.findFirst({
      where: { name: planName },
    });
    if (!plan) {
      const errorCode = await this.prisma.getErrorCode('plan', 'NotFound');
      throw new NotFoundException(errorCode);
    }
    return plan;
  }

  async buillingConfirm(
    userId: string,
    subscriptionId: string,
    customerKey: string,
    data: SuccessPayment,
  ) {
    // const plan = await this.prisma.plan.findFirst({
    //   where: { name: planName },
    // });
    await this.prisma.payment.create({
      data: {
        userId,
        subscriptionId: subscriptionId,
        mId: data.mId,
        paymentKey: data.paymentKey,
        orderId: data.orderId,
        orderName: data.orderName,
        customerKey: customerKey,
        amount: data.card.amount,
        taxFreeAmount: data.taxFreeAmount,
        taxExemptionAmount: data.taxExemptionAmount,
        lastTransactionKey: data.lastTransactionKey,
        status: data.status,
        useEscrow: data.useEscrow,
        cultureExpense: data.cultureExpense,
        cardIssuerCode: data.card.issuerCode,
        cardAcquirerCode: data.card.acquirerCode,
        cardNumber: data.card.number,
        cardInstallmentPlanMonths: data.card.installmentPlanMonths,
        cardIsInterestFree: data.card.isInterestFree,
        cardInterestPayer: data.card.interestPayer,
        cardApproveNo: data.card.approveNo,
        useCardPoint: data.card.useCardPoint,
        cardType: data.card.cardType,
        cardOwnerType: data.card.ownerType,
        cardAcquireStatus: data.card.acquireStatus,
        cardAmount: data.card.amount,
        secret: data.secret,
        type: data.type,
        country: data.country,
        isPartialCancelable: data.isPartialCancelable,
        receiptUrl: data.receipt.url,
        checkoutUrl: data.checkout.url,
        currency: data.currency,
        totalAmount: data.totalAmount,
        balanceAmount: data.balanceAmount,
        suppliedAmount: data.suppliedAmount,
        vat: data.vat,
        method: data.method,
        version: data.version,
      },
    });
  }

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
    this.logger.debug(userId);
    const plan = await this.prisma.plan.findUnique({ where: { planType } });
    if (!plan) {
      const errorCode = await this.prisma.getErrorCode('plan', 'NotFound');
      throw new NotFoundException(errorCode);
    }

    const subscribed = await this.prisma.subscription.findFirst({
      where: {
        userId,
        endDate: null,
      },
    });

    this.logger.info(subscribed, userId, plan.id);

    if (subscribed) {
      // update
      return this.prisma.subscription.update({
        where: { id: subscribed.id },
        data: {
          type,
          planId: plan.id,
          state: State.Active,
        },
      });
    } else {
      // create
      return this.prisma.subscription.create({
        data: {
          type,
          planId: plan.id,
          state: State.Active,
          userId,
        },
      });
    }
  }

  async unsubscribe(subscriptionId: string) {
    const freePlan = await this.prisma.plan.findUnique({
      where: { planType: PlanType.Free },
    });
    const freePlanId = freePlan.id;
    return await this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        state: State.Active,
        endDate: null,
        type: SubscribeType.Infinite,
        planId: freePlanId,
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

  async cancelPayment(userId: string) {
    return this.prisma.$transaction(async () => {
      const base64Secret = this.getBase64Secret();
      const payments = await this.prisma.payment.findMany({
        where: {
          userId,
          deletedAt: null,
        },
      });

      for (const payment of payments) {
        try {
          const { data } = await firstValueFrom(
            this.httpService.post(
              `https://api.tosspayments.com/v1/payments/${payment.paymentKey}/cancel`,
              { cancelReason: 'unsbscribe' },
              {
                headers: {
                  Authorization: `Basic ${base64Secret}`,
                  'Content-Type': 'application/json',
                },
              },
            ),
          );
          this.logger.info(data);
        } catch (error) {
          this.logger.error(error.code, error.message);
        }
      }

      return this.prisma.payment.updateMany({
        where: { id: { in: payments.map((payment) => payment.id) } },
        data: { deletedAt: new Date() },
      });

      // return this.prisma.subscription.updateMany({
      //   where: {
      //     payment: {
      //       some: {
      //         id: { in: payments.map((payment) => payment.id) },
      //       },
      //     },
      //   },
      //   data: {
      //     state: State.Cancelled,
      //     endDate: new Date(),
      //   },
      // });
    });
  }

  async cancelPaymentByUserId(userId: string, cancelReason: string) {
    const base64Secret = this.getBase64Secret();

    const payments = await this.prisma.payment.findMany({
      where: {
        userId,
        deletedAt: null,
      },
    });

    for (const payment of payments) {
      try {
        const { data } = await firstValueFrom(
          this.httpService.post(
            `https://api.tosspayments.com/v1/payments/${payment.paymentKey}/cancel`,
            { cancelReason },
            {
              headers: {
                Authorization: `Basic ${base64Secret}`,
                'Content-Type': 'application/json',
              },
            },
          ),
        );
        this.logger.info(data);
      } catch (error) {
        this.logger.error(error.code, error.message);
      }
    }

    await this.prisma.payment.updateMany({
      where: { userId },
      data: { deletedAt: new Date() },
    });

    // return { code, message };
  }
}
