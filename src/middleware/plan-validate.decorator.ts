import { Reflector } from '@nestjs/core';

export type ValidateType =
  | 'pollCreate'
  | 'pollResponse'
  | 'voteCreate'
  | 'voteResponse';
export const PlanValidate = Reflector.createDecorator<ValidateType>();
