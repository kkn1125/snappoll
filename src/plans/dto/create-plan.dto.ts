import { $Enums, Feature, Plan, Subscription } from '@prisma/client';

export class CreatePlanDto
  implements Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>
{
  name: string;
  planType: $Enums.PlanType;
  description: string;
  price: number;
  discount: number;

  feature?: Feature[];
  subscription?: Subscription[];
  _count?: {
    subscription: number;
    feature: number;
  };
}
