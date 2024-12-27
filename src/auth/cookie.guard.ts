import { PrismaService } from '@database/prisma.service';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import SnapLogger from '@utils/SnapLogger';
import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AuthService } from './auth.service';
import { EncryptManager } from '@utils/EncryptManager';

@Injectable()
export class CookieGuard implements CanActivate {
  logger = new SnapLogger(this);

  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    private readonly encryptManager: EncryptManager,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic =
      this.reflector.get<boolean>(
        'isPublic',
        context.getHandler(), // 메서드에서 메타데이터를 가져옴
      ) ||
      this.reflector.get<boolean>(
        'isPublic',
        context.getClass(), // 클래스에서 메타데이터를 가져옴
      );

    // this.logger.info(isPublic);

    if (isPublic) {
      this.logger.debug('쿠키 통과');
      try {
        const http = context.switchToHttp();
        const req = http.getRequest() as Request;
        if (req.cookies.token) {
          const decoded = jwt.decode(req.cookies.token) as JwtPayload;
          if (decoded) {
            const user = await this.authService.getMe(decoded.email);
            if (user) {
              req.user = user;
            }
          }
        }
      } catch (error) {
        this.logger.debug(
          '쿠키 무시 중 회원이 통과 될 때 오류 발생 (확인 필요)',
        );
      }
      return true;
    }

    const http = context.switchToHttp();
    const req = http.getRequest() as Request;
    const res = http.getResponse() as Response;
    const secretKey = this.configService.get('common.secretKey');

    if (!req.cookies.token) {
      this.logger.debug('쿠키 토큰 없음');

      this.clearCookies(res);
      const errorCode = await this.prisma.getErrorCode('auth', 'NoExistsToken');

      throw new UnauthorizedException(errorCode);
    }

    let verifiedToken: JwtPayload;
    try {
      verifiedToken = jwt.verify(req.cookies.token, secretKey, {
        algorithms: ['HS256'],
      }) as JwtPayload;
    } catch (error) {
      verifiedToken = req.verify = jwt.decode(req.cookies.token) as JwtPayload;

      if (error.name === 'JsonWebTokenError') {
        /* 잘못된 토큰 형식 */
        const errorCode = await this.authService.prisma.getErrorCode(
          'auth',
          'WrongToken',
        );
        this.clearCookies(res);
        throw new UnauthorizedException(errorCode);
      } else if (error.name === 'TokenExpiredError') {
        this.logger.error('token expired error:', error);
        /* 토큰 만료 */
        await this.handleRefreshTokenProvide(req, res, secretKey);
      } else {
        /* 그 외 에러 */
        this.clearCookies(res);
        const errorCode = await this.authService.prisma.getErrorCode(
          'auth',
          'BadRequest',
        );
        throw new BadRequestException(errorCode);
      }
    }
    // this.logger.debug(verifiedToken);

    const email = verifiedToken?.email;
    const user = await this.authService.getMe(email);

    if (!user) {
      this.logger.debug('사용자 없음');

      this.clearCookies(res);
      const errorCode = await this.prisma.getErrorCode('auth', 'NotFound');
      throw new NotFoundException(errorCode);
    }

    if (user.isActive === false) {
      this.logger.info('활동정지된 회원');
      const errorCode = await this.prisma.getErrorCode('user', 'Deactivated');
      throw new BadRequestException(errorCode);
    }

    // this.logger.debug('email:', verifiedToken.email);
    // this.logger.debug('user:', user);

    req.verify = verifiedToken;
    req.user = user;

    return true;
  }

  async handleRefreshTokenProvide(
    req: Request,
    res: Response,
    secretKey: string,
  ) {
    try {
      const verifiedRefreshToken = jwt.verify(req.cookies.refresh, secretKey, {
        algorithms: ['HS256'],
      }) as JwtPayload;

      const user = await this.authService.getMe(verifiedRefreshToken.email);

      if (!user) {
        const errorCode = await this.prisma.getErrorCode('auth', 'NotFound');
        throw new NotFoundException(errorCode);
      }

      const { id, email, username, authProvider, loginAt } =
        verifiedRefreshToken;
      const { token, refreshToken } = this.encryptManager.getToken({
        id,
        email,
        username,
        authProvider,
        loginAt,
        refreshAt: Date.now(),
      });

      // req.verify = verifiedRefreshToken;
      req.user = user;

      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
      });
      res.cookie('refresh', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
      });
      this.logger.debug('토큰 재발급 완료');
    } catch (error) {
      const decoded = jwt.decode(req.cookies.refresh) as JwtPayload;
      this.logger.debug(error.name, error.message);
      this.logger.debug('invalid refresh token!');
      this.clearCookies(res);
      /* 리프레시 만료 시 마지막 로그인 시간 기록 */
      if (decoded) {
        const user = await this.authService.getMe(decoded.email);
        if (user) {
          this.authService.lastLogin(user.id);
        }
      }
      const errorCode = await this.authService.prisma.getErrorCode(
        'auth',
        'ExpiredRefreshToken',
      );
      throw new UnauthorizedException(errorCode);
    }
  }

  private clearCookies(res: Response) {
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
    });
    res.clearCookie('refresh', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
    });
  }
}
