import {
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { CookieGuard } from './cookie.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req: Request, @Res() res: Response) {
    if (req.user) {
      const user = req.user;
      const jsonwebtoken = this.authService.getToken({
        id: user.id,
        username: user.username,
        email: user.email,
      });

      res.cookie('token', jsonwebtoken, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
      });

      res.json({
        ok: true,
        token: jsonwebtoken,
        user,
      });
    } else {
      throw new UnauthorizedException('회원정보를 다시 확인해주세요.');
    }
  }

  @UseGuards(CookieGuard)
  @Post('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    if (req.user) {
      res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
      });

      res.json({
        ok: true,
      });
    } else {
      throw new UnauthorizedException('잘못된 접근입니다.');
    }
  }

  @UseGuards(CookieGuard)
  @Post('verify')
  async verify(@Req() req: Request, @Res() res: Response) {
    if (!req.verify) {
      throw new UnauthorizedException('토큰이 만료되었습니다.');
    }
    const profile = req.user?.['userProfile'];
    // console.log('profile:', profile);
    // const blob = new Blob([new Uint8Array(profile.data)], {
    //   type: 'image/jpeg',
    // });
    // const dataUrl = URL.createObjectURL(blob);
    res.json({
      ok: !!req.user,
      token: req.cookies?.token,
      userId: req.user?.id,
      username: req.user?.username,
      profile: profile?.[0]?.image,
    });
  }
}
