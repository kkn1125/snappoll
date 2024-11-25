import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '@database/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    if (
      !(createUserDto.email && createUserDto.password && createUserDto.username)
    ) {
      throw new BadRequestException('입력 정보가 누락되었습니다.');
    }

    const existsUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (!!existsUser) {
      throw new BadRequestException('이메일이 중복됩니다.', {
        cause: createUserDto.email,
      });
    }

    const password = this.prisma.encryptPassword(createUserDto.password);
    createUserDto.password = password;

    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({ where: { id }, data: updateUserDto });
  }

  remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
