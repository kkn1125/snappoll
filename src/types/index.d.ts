import { Role } from '@common/enums/Role';
import {
  User as PrismaUser,
  Subscription as PrismaSubscription,
  UserProfile,
  Plan,
} from '@prisma/client';

export declare global {
  interface SuccessPayment {
    mId: string;
    lastTransactionKey: string;
    paymentKey: string;
    orderId: string;
    orderName: string;
    taxExemptionAmount: number;
    status: string;
    requestedAt: string;
    approvedAt: string;
    useEscrow: boolean;
    cultureExpense: boolean;
    card: {
      issuerCode: string;
      acquirerCode: string;
      number: string;
      installmentPlanMonths: number;
      isInterestFree: boolean;
      interestPayer: null;
      approveNo: string;
      useCardPoint: boolean;
      cardType: string;
      ownerType: string;
      acquireStatus: string;
      amount: number;
    };
    virtualAccount: null;
    transfer: null;
    mobilePhone: null;
    giftCertificate: null;
    cashReceipt: null;
    cashReceipts: null;
    discount: null;
    cancels: null;
    secret: string;
    type: string;
    easyPay: null;
    country: string;
    failure: null;
    isPartialCancelable: true;
    receipt: {
      url: string;
    };
    checkout: {
      url: string;
    };
    currency: string;
    totalAmount: number;
    balanceAmount: number;
    suppliedAmount: number;
    vat: number;
    taxFreeAmount: number;
    method: string;
    version: string;
    metadata: null;
  }

  namespace Express {
    interface Subscription extends PrismaSubscription {
      plan: Plan;
    }
    interface User extends Omit<PrismaUser, 'password'> {
      userProfile?: Partial<UserProfile>;
      subscription?: Subscription;
    }
    interface Request {
      user?: User;
    }
  }

  export declare interface UserTokenData {
    id: string;
    email: string;
    username: string;
    authProvider: 'Local' | 'Kakao' | 'Google';
    loginAt: number;
    refreshAt?: number;
  }

  export declare interface CustomErrorFormat {
    status: number;
    domain: string;
    errorStatus: number;
    message: string;
  }
}

declare module 'jsonwebtoken' {
  export declare interface CustomPayload {
    id: string;
    email: string;
    username: string;
    authProvider: 'Local' | 'Kakao' | 'Google';
    loginAt: number;
    refreshAt?: number;
  }
  export declare interface JwtPayload extends CustomPayload {}
  // declare interface CustomPayload extends jwt.JwtPayload {
  //   role: Role;
  // }
}

declare module 'express' {
  interface Request {
    verify?: JwtPayload;
    token?: string;
  }
}
