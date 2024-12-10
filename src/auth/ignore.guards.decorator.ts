import { SetMetadata } from '@nestjs/common';

export const IgnoreGuard = () => SetMetadata('isPublic', true);
