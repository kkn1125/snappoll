import { Role } from '@common/enums/Role';
import {
  User as PrismaUser,
  Subscription as PrismaSubscription,
  UserProfile,
  Plan,
} from '@prisma/client';

export declare global {
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
