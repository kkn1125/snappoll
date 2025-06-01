import { IgnoreCookie } from '@auth/ignore-cookie.decorator';
import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateTermDto } from './dto/update-term.dto';
import { TermsService } from './terms.service';

@ApiTags('약관')
@Controller('terms')
export class TermsController {
  constructor(private readonly termsService: TermsService) {}

  // @Post()
  // create(@Body() createTermDto: CreateTermDto) {
  //   return this.termsService.create(createTermDto);
  // }

  @IgnoreCookie()
  @Get()
  findLatestVersion() {
    return this.termsService.findLatestVersion();
  }

  @IgnoreCookie()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.termsService.findOne(id);
  }

  @Get('users/:id/agreed')
  userAgreedTerms(@Param('id') id: string) {
    return this.termsService.userAgreedTerms(id);
  }

  // @Post('agree')
  // agreeTerm(@Body() agreeDto: AgreeDto) {
  //   return this.termsService.agreeTerm(agreeDto);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTermDto: UpdateTermDto) {
    return this.termsService.update(id, updateTermDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.termsService.remove(id);
  // }
}
