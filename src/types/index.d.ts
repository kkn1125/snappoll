import { User as PrismaUser } from '@prisma/client';

export declare global {
  namespace Express {
    interface User extends PrismaUser {}
    interface Request {
      user?: User;
    }
  }
}
