import { Injectable } from '@nestjs/common';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PrismaService } from '@database/prisma.service';

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

  update(id: string, updatePlanDto: UpdatePlanDto) {}

  // remove(id: string) {
  //   return `This action removes a #${id} plan`;
  // }
}
