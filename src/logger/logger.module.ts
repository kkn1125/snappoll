import { Global, Module } from '@nestjs/common';
import SnapLoggerService from './logger.service';

@Global()
@Module({
  providers: [SnapLoggerService],
  exports: [SnapLoggerService],
})
export class LoggerModule {}
