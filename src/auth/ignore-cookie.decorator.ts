import { SetMetadata } from '@nestjs/common';

export const IgnoreCookie = () => SetMetadata('isPublic', true);
