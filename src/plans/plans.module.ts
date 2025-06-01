import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PlansController } from './plans.controller';
import { PlansService } from './plans.service';

@Module({
  imports: [HttpModule],
  controllers: [PlansController],
  providers: [PlansService],
})
export class PlansModule {}
