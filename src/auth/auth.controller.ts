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
      const { id, username, email } = req.user;
      const jsonwebtoken = this.authService.getToken({ id, username, email });

      res.cookie('token', jsonwebtoken, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
      });
      res.json({
        ok: true,
        token: jsonwebtoken,
      });
    } else {
      throw new UnauthorizedException();
    }
  }

  @UseGuards(CookieGuard)
  @Post('verify')
  async verify(@Req() req: Request) {
    return {
      ok: !!req.user,
      token: req.cookies?.token,
    };
  }
}
