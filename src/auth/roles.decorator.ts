import { Role } from '@common/enums/Role';
import { Reflector } from '@nestjs/core';

export const Roles = Reflector.createDecorator<Role[]>();
