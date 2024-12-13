import { Controller, Get, Param, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import * as path from 'path';
import { BasicService } from './basic.service';

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

  @Get('upload/:filename')
  getImageFile(@Param('filename') filename: string, @Res() res: Response) {
    res.sendFile(path.join(path.resolve(), 'upload', filename));
  }
}
