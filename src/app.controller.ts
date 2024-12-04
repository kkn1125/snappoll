import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(private readonly configService: ConfigService) {}
  @Get('version')
  checkVersion() {
    const version = this.configService.get<string>('common.VERSION');
    return {
      ok: true,
      version,
    };
  }
}
