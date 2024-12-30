import { SetMetadata } from '@nestjs/common';

export const IgnoreThrottle = () => SetMetadata('THROTTLER:IGNORE', true);
