import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { ScheduleService } from './schedule.service';

@Module({
  providers: [EventsService, ScheduleService],
  exports: [EventsService],
})
export class EventsModule {}
