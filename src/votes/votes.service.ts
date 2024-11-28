import { Injectable } from '@nestjs/common';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { PrismaService } from '@database/prisma.service';

@Injectable()
export class VotesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createVoteDto: CreateVoteDto) {
    return this.prisma.vote.create({
      data: createVoteDto,
    });
  }

  findAll() {
    return this.prisma.vote.findMany();
  }

  findMe(id: string) {
    return this.prisma.vote.findMany({ where: { userId: id } });
  }

  findOne(id: string) {
    return this.prisma.vote.findUnique({ where: { id } });
  }

  update(id: string, updateVoteDto: UpdateVoteDto) {
    return this.prisma.vote.update({ where: { id }, data: updateVoteDto });
  }

  remove(id: string) {
    return this.prisma.vote.delete({ where: { id } });
  }
}
