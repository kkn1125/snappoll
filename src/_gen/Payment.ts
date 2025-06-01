import { ApiProperty } from '@nestjs/swagger';

import { Subscription } from './Subscription';
import { User } from './User';

export class Payment {
  @ApiProperty({ type: Number })
  id!: number;
  @ApiProperty({ type: String })
  userId!: string;
  @ApiProperty({ type: String })
  subscriptionId!: string;
  @ApiProperty({ type: String })
  mId!: string;
  @ApiProperty({ type: String })
  paymentKey!: string;
  @ApiProperty({ type: String })
  orderId!: string;
  @ApiProperty({ type: String })
  orderName!: string;
  @ApiProperty({ type: String })
  customerKey!: string;
  @ApiProperty({ type: Number })
  amount!: number;
  @ApiProperty({ type: Number })
  taxFreeAmount!: number;
  @ApiProperty({ type: Number })
  taxExemptionAmount!: number;
  @ApiProperty({ type: String })
  lastTransactionKey!: string;
  @ApiProperty({ type: String })
  status!: string;
  @ApiProperty({ type: Boolean })
  useEscrow!: boolean;
  @ApiProperty({ type: Boolean })
  cultureExpense!: boolean;
  @ApiProperty({ type: String })
  cardIssuerCode!: string;
  @ApiProperty({ type: String })
  cardAcquirerCode!: string;
  @ApiProperty({ type: String })
  cardNumber!: string;
  @ApiProperty({ type: Number })
  cardInstallmentPlanMonths!: number;
  @ApiProperty({ type: Boolean })
  cardIsInterestFree!: boolean;
  @ApiProperty({ type: String })
  cardInterestPayer!: string | null;
  @ApiProperty({ type: String })
  cardApproveNo!: string;
  @ApiProperty({ type: Boolean })
  useCardPoint!: boolean;
  @ApiProperty({ type: String })
  cardType!: string;
  @ApiProperty({ type: String })
  cardOwnerType!: string;
  @ApiProperty({ type: String })
  cardAcquireStatus!: string;
  @ApiProperty({ type: Number })
  cardAmount!: number;
  @ApiProperty({ type: String })
  secret!: string;
  @ApiProperty({ type: String })
  type!: string;
  @ApiProperty({ type: String })
  country!: string;
  @ApiProperty({ type: Boolean })
  isPartialCancelable!: boolean;
  @ApiProperty({ type: String })
  receiptUrl!: string | null;
  @ApiProperty({ type: String })
  checkoutUrl!: string | null;
  @ApiProperty({ type: String })
  currency!: string;
  @ApiProperty({ type: Number })
  totalAmount!: number;
  @ApiProperty({ type: Number })
  balanceAmount!: number;
  @ApiProperty({ type: Number })
  suppliedAmount!: number;
  @ApiProperty({ type: Number })
  vat!: number;
  @ApiProperty({ type: String })
  method!: string;
  @ApiProperty({ type: String })
  version!: string;
  @ApiProperty({ type: Date })
  createdAt!: Date;
  @ApiProperty({ type: Date })
  updatedAt!: Date;
  @ApiProperty({ type: Date })
  deletedAt!: Date | null;
  @ApiProperty({ type: () => Subscription })
  subscription!: Subscription;
  @ApiProperty({ type: () => User })
  user!: User;
}
