import { PrismaService } from '@database/prisma.service';
import { Injectable } from '@nestjs/common';
import { AgreeDto } from './dto/agree.dto';
import { UpdateTermDto } from './dto/update-term.dto';

@Injectable()
export class TermsService {
  constructor(private readonly prisma: PrismaService) {}

  userAgreedTerms(id: string) {
    return this.prisma.allowTerms.findMany({
      where: { userId: id },
      include: {
        terms: true,
      },
    });
  }

  agreeTerm(agreeDto: AgreeDto) {
    return this.prisma.allowTerms.create({
      data: agreeDto,
    });
  }

  // create(createTermDto: CreateTermDto) {
  //   return 'This action adds a new term';
  // }

  findAll() {
    const terms = this.prisma.terms.findMany();
    return terms;
  }

  findLatestVersion() {
    const terms = this.prisma.terms.findFirst({
      orderBy: { version: 'desc' },
      include: {
        termsSection: true,
      },
    });
    return terms;
  }

  findOne(id: string) {
    return `This action returns a #${id} term`;
  }

  update(id: string, updateTermDto: UpdateTermDto) {
    return `This action updates a #${id} term`;
  }

  // remove(id: string) {
  //   return `This action removes a #${id} term`;
  // }
}
