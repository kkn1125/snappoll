import { IgnoreCookie } from '@auth/ignore-cookie.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseFilters,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { ErrorPageFilter } from './error-page.filter';
import { ViewsService } from './views.service';
import SnapLogger from '@utils/SnapLogger';
import { $Enums } from '@prisma/client';

@IgnoreCookie()
@Controller('manage')
@UseFilters(ErrorPageFilter)
export class ViewsController {
  logger = new SnapLogger(this);

  // loggedIn: boolean = true;

  constructor(
    private readonly configService: ConfigService,
    private readonly viewsService: ViewsService,
  ) {}

  @UseFilters(ErrorPageFilter)
  @Get()
  async root(@Req() req: Request, @Res() res: Response) {
    const token = req.cookies['admin-token'];
    if (!!token) {
      const users = await this.viewsService.findUsers();
      this.logger.debug(users);
      res.render('index', {
        title: 'Main',
        loggedIn: true,
        columns: Object.keys(users?.[0] || {}),
        users,
      });
    } else {
      res.render('login', {
        title: 'Login',
      });
    }
  }

  @Get('board')
  async board(@Req() req: Request, @Res() res: Response) {
    const token = req.cookies['admin-token'];
    if (!!token) {
      const boards = await this.viewsService.findBoards();
      this.logger.debug(boards);
      res.render('board', {
        title: 'Board',
        loggedIn: true,
        columns: [
          'id',
          'title',
          'category',
          'viewCount',
          'isPrivate',
          'isOnlyCrew',
          'createdAt',
          'updatedAt',
          'deletedAt',
        ],
        boards,
      });
    } else {
      res.render('login', {
        title: 'Login',
      });
    }
  }

  @Post('login')
  async login(
    @Body() loginData: { email: string; password: string },
    @Res() res: Response,
  ) {
    this.logger.debug(loginData);
    const result = await this.viewsService.login(loginData);
    this.logger.info('결과:', result);
    if (!result) {
      res.render('login', {
        title: 'Login | Fail',
        email: loginData.email,
        password: loginData.password,
        fail: true,
      });
    } else {
      const { token } = result;
      res.cookie('admin-token', token);
      // this.loggedIn = true;
      res.redirect('/manage');
    }
  }

  @Put('user/:id/grade')
  async changeGradeFromId(
    @Res() res: Response,
    @Param('id') id: string,
    @Body('grade') grade: $Enums.Grade,
  ) {
    await this.viewsService.changeGradeFromId(id, grade);
    res.redirect('/manage');
  }

  @Put('user/:id/role')
  async changeRoleFromId(
    @Res() res: Response,
    @Param('id') id: string,
    @Body('role') role: $Enums.Role,
  ) {
    console.log(role);
    await this.viewsService.changeRoleFromId(id, role);
    res.redirect('/manage');
  }

  @Put('user/:id/activate')
  async activateFromId(@Res() res: Response, @Param('id') id: string) {
    await this.viewsService.activateFromId(id, true);
    res.redirect('/manage');
  }

  @Put('user/:id/deactivate')
  async deactivateFromId(@Res() res: Response, @Param('id') id: string) {
    await this.viewsService.activateFromId(id, false);
    res.redirect('/manage');
  }

  @Put('board/:id/category')
  async categoryFromId(
    @Res() res: Response,
    @Param('id') id: string,
    @Body('category') category: string,
  ) {
    await this.viewsService.categoryFromId(id, category);
    res.redirect('/manage/board');
  }

  @Put('board/:id/private')
  async privateFromId(@Res() res: Response, @Param('id') id: string) {
    await this.viewsService.publicOrPrivateFromId(id, true);
    res.redirect('/manage/board');
  }

  @Put('board/:id/public')
  async publicFromId(@Res() res: Response, @Param('id') id: string) {
    await this.viewsService.publicOrPrivateFromId(id, false);
    res.redirect('/manage/board');
  }

  @Put('board/:id/crew')
  async crewFromId(@Res() res: Response, @Param('id') id: string) {
    await this.viewsService.crewOrAllFromId(id, true);
    res.redirect('/manage/board');
  }

  @Put('board/:id/all')
  async allFromId(@Res() res: Response, @Param('id') id: string) {
    await this.viewsService.crewOrAllFromId(id, false);
    res.redirect('/manage/board');
  }

  @Put('user/:id')
  async revokeFromId(@Res() res: Response, @Param('id') id: string) {
    await this.viewsService.revokeFromId(id);
    res.redirect('/manage');
  }

  @Delete('user/:id')
  async deleteUserFromId(@Res() res: Response, @Param('id') id: string) {
    await this.viewsService.deleteUserFromId(id);
    res.redirect('/manage');
  }

  @Delete('board/:id')
  async deleteBoardFromId(@Res() res: Response, @Param('id') id: string) {
    await this.viewsService.deleteBoardFromId(id);
    res.redirect('/manage/board');
  }

  @Get('logout')
  logout(@Res() res: Response) {
    // this.loggedIn = false;
    res.clearCookie('admin-token');
    res.redirect('/manage');
  }

  @Get('about')
  about(@Res() res: Response) {
    res.render('about', {
      title: 'About',
    });
  }

  @Get('*')
  notfound(@Res() res: Response) {
    res.render('notfound');
  }
}
