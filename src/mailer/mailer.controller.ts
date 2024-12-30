import { Body, Controller, Param, Post } from '@nestjs/common';
import { MailerService } from './mailer.service';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Post('all/:type/:id')
  async sendMailToAll(@Param('type') type: string, @Param('id') id: string) {
    // return this.mailerService.sendManualMail(type, id);
  }

  @Post('specific/:type/:id')
  async sendMailToSpecific(
    @Param('type') type: string,
    @Param('id') id: string,
    @Body() specificUsers: string[],
  ) {
    // return this.mailerService.sendManualMail(type, id);
  }
}
