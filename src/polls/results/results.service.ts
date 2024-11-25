import { Injectable } from '@nestjs/common';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { PrismaService } from '@database/prisma.service';

@Injectable()
export class ResultsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createResultDto: CreateResultDto) {
    return this.prisma.pollResult.create({
      data: createResultDto,
    });
  }

  findAll() {
    return this.prisma.pollResult.findMany();
  }

  findOne(id: string) {
    return this.prisma.pollResult.findUnique({ where: { id } });
  }

  update(id: string, updateResultDto: UpdateResultDto) {
    return this.prisma.pollResult.update({
      where: { id },
      data: updateResultDto,
    });
  }

  remove(id: string) {
    return this.prisma.pollResult.delete({ where: { id } });
  }
}
