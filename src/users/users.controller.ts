import { TermsService } from '@/terms/terms.service';
import { IgnoreCookie } from '@auth/ignore-cookie.decorator';
import { IgnoreThrottle } from '@auth/ignore-throttle.decorator';
import { PrismaService } from '@database/prisma.service';
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import SnapLogger from '@utils/SnapLogger';
import { Request, Response } from 'express';
import { memoryStorage } from 'multer';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { ConfigService } from '@nestjs/config';
import { RoleGuard } from '@auth/role.guard';
import { Roles } from '@auth/roles.decorator';

@UseGuards(RoleGuard)
@Controller('users')
export class UsersController {
  logger = new SnapLogger(this);

  constructor(
    private readonly usersService: UsersService,
    private readonly termsService: TermsService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  @Roles(['Admin'])
  @IgnoreCookie()
  @Post()
  async create(
    @Body('masterPass') masterPass: string,
    @Body(new ValidationPipe({ transform: true }))
    createUserDto: CreateUserDto & {
      privacyPolicy: boolean;
      serviceAgreement: boolean;
    },
  ) {
    const master = this.configService.get('email.masterPass');
    if (!masterPass || masterPass !== master) {
      throw new ForbiddenException({
        status: 403,
        domain: 'server',
        errorStatus: -999,
        message:
          '현재 회원가입을 허용하지 않고 있습니다.\n제한된 인원에게 계정을 발급하고 있으니 양해바랍니다.\n\n문의사항은 "회원 가입 안내" 하단의 대표 이메일로 문의 주시기 바랍니다.',
      });
    }
    const user = await this.prisma.$transaction(async (prisma) => {
      if ('masterPass' in createUserDto) {
        delete createUserDto.masterPass;
      }
      const { privacyPolicy, serviceAgreement, ...createUserDtoData } =
        createUserDto;
      const user = await this.usersService.create(
        privacyPolicy,
        serviceAgreement,
        createUserDtoData,
      );
      this.logger.info('user data:', user);
      const terms = await this.termsService.findLatestVersion();
      for (const section of terms.termsSection) {
        this.logger.debug(section.termsId);
        await this.termsService.agreeTerm({
          userId: user.id,
          termsId: section.termsId,
        });
      }
      return user;
    });
    return user;
  }

  @Get()
  findAll(@Query('page') page: number = 1) {
    return this.usersService.findAll(page);
  }

  @Get('me')
  findMe(@Req() req: Request) {
    return req.user;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @IgnoreCookie()
  @Get('profile/:id')
  @IgnoreThrottle()
  async getProfileImage(@Res() res: Response, @Param('id') profileId: string) {
    const image = await this.usersService.getProfileImage(profileId);
    // console.log(image.image instanceof Buffer);
    this.logger.debug('image.mimetype', image.mimetype);
    // 이미지 응답
    res.setHeader('Content-Type', image.mimetype);
    // res.setHeader(
    //   'Content-Disposition',
    //   `inline; filename="${image.filename}"`,
    // );
    res.send(Buffer.from(image.image));
  }

  @UseInterceptors(
    FileInterceptor('file', {
      storage:
        memoryStorage(/* {
        // destination: './upload',
        filename(req, file, callback) {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${uniqueSuffix}-${file.originalname}`);
        },
      } */),
    }),
  )
  @Put('profile')
  async uploadProfile(
    @Req() req: Request,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: 200 * 1000,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    const id = req.user.id;
    this.logger.debug(file);
    const { image, ...fileData } = await this.usersService.uploadProfile(
      id,
      file,
    );

    return fileData;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Roles(['Admin'])
  // @IgnoreCookie()
  @Put(':id/password')
  updatePassword(
    @Param('id') id: string,
    @Body('currentPassword') currentPassword: string,
    @Body() updateUserDto: UpdateUserPasswordDto,
  ) {
    return this.usersService.updatePassword(id, currentPassword, updateUserDto);
  }

  @Delete('profile')
  deleteProfileImage(@Req() req: Request) {
    const id = req.user.id;
    return this.usersService.deleteProfileImage(id);
  }

  @Roles(['Admin'])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
