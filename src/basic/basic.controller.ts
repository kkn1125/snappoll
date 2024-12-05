import { Controller, Get, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BasicService } from './basic.service';
import { Response } from 'express';

@Controller()
export class BasicController {
  constructor(
    private readonly configService: ConfigService,
    private readonly basicService: BasicService,
  ) {}

  @Get('/sitemap.xml')
  async sitemap(@Res() res: Response) {
    res.setHeader('Content-Type', 'application/xml');
    res.send(await this.basicService.sitemap());
  }

  @Get('version')
  checkVersion() {
    const version = this.configService.get<string>('common.VERSION');
    return {
      ok: true,
      version,
    };
  }
}
