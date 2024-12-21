import commonConf from '@common/common.conf';
import whiteList from '@common/whiteList';
import { HttpExceptionFilter } from '@middleware/http-exception.filter';
import { ResponseInterceptor } from '@middleware/response.interceptor';
import { RequestMethod } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { allowOrigins } from '@utils/allowOrigins';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import * as path from 'path';
import { AppModule } from './app.module';
import hbs from 'hbs';
import * as exphbs from 'express-handlebars';
import dayjs from 'dayjs';

declare const module: any;

// console.log('Current working directory:', process.cwd());
// console.log(
//   'Resolved path for ./auth/auth.module:',
//   require.resolve('./auth/auth.module'),
// );

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  // app.useLogger(new SnapLogger());
  const { hosts, ports } = whiteList;
  const configService = app.get(ConfigService);
  const common = configService.get<ConfigType<typeof commonConf>>('common');

  const allowList = allowOrigins(hosts, ports);
  console.log('allowList:', allowList);

  app.enableCors({
    origin: allowList,
    credentials: true,
  });
  app.setGlobalPrefix('api', {
    exclude: [
      { path: 'sitemap.xml', method: RequestMethod.GET },
      {
        path: 'version',
        method: RequestMethod.GET,
      },
      {
        path: 'preview(.*)',
        method: RequestMethod.GET,
      },
      {
        path: 'manage(.*)',
        method: RequestMethod.ALL,
      },
    ],
  });
  app.use(cookieParser());
  app.use(compression());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  // app.useStaticAssets(path.join(path.resolve(), 'src', 'mailer', 'public'));
  // app.setBaseViewsDir(path.join(path.resolve(), 'src', 'mailer', 'template'));
  // 템플릿 엔진 설정
  // app.engine(
  //   'hbs',
  //   exphbs.engine({
  //     extname: 'hbs',
  //     layoutsDir: path.join(
  //       path.resolve(),
  //       'src',
  //       'mailer',
  //       'template',
  //       'layouts',
  //     ),
  //     partialsDir: path.join(
  //       path.resolve(),
  //       'src',
  //       'mailer',
  //       'template',
  //       'partials',
  //     ),
  //     defaultLayout: 'main', // 기본 레이아웃 파일 이름
  //     helpers: {
  //       managePath: (path: string) => `/manage${path}`,
  //       eqOr: function (a1: any, a2: any, a3: any, a4: any) {
  //         // console.log(a1, a2, a3, a4);
  //         return a1 === a2 ? a3 : a4;
  //       },
  //       eq: function (a1: any, a2: any) {
  //         return a1 === a2;
  //       },
  //       sliceText: function (a1: any, start: any, end: any) {
  //         if (!a1) {
  //           return '';
  //         }
  //         return a1.slice(start, end) + (a1.length < end ? '' : '...');
  //       },
  //       isNil(a1: any) {
  //         return (
  //           JSON.stringify(a1 ?? '') === '{}' || a1 === undefined || a1 === null
  //         );
  //       },
  //       isDate(a1: any) {
  //         return a1 instanceof Date;
  //       },
  //       dateFormat: function (a1: any) {
  //         return JSON.stringify(a1 ?? '') === '{}' ||
  //           a1 === undefined ||
  //           a1 === null
  //           ? '-'
  //           : dayjs(a1).format('YYYY. MM. DD. HH:mm');
  //       },
  //       ifTrue(a1: any, a2?: any) {
  //         // console.log('디버깅:', a1, a2);
  //         return a1 ? a2 : '';
  //       },
  //       translate: function (a1: any, type: string = 'user') {
  //         switch (a1) {
  //           case 'id':
  //             return 'No.';
  //           case 'title':
  //             return '제목';
  //           case 'author':
  //             return '작성자';
  //           case 'category':
  //             return '유형';
  //           case 'viewCount':
  //             return '조회수';
  //           case 'isPrivate':
  //             return '비공개 여부';
  //           case 'isOnlyCrew':
  //             return '회원만 공개 여부';
  //           case 'email':
  //             return '이메일';
  //           case 'username':
  //             return '유저명';
  //           case 'isActive':
  //             return '활동여부';
  //           case 'lastLogin':
  //             return '마지막 로그인 시간';
  //           case 'authProvider':
  //             return '회원유형';
  //           case 'grade':
  //             return '등급';
  //           case 'role':
  //             return '역할';
  //           case 'createdAt':
  //             return '회원 가입 시간';
  //           case 'updatedAt':
  //             return '정보 수정 시간';
  //           case 'deletedAt':
  //             return type === 'user' ? '회원 탈퇴 시간' : '삭제 시간';
  //           default:
  //             return a1;
  //         }
  //       },
  //       findIndex: function (a1: any[], a2: any) {
  //         return a1?.findIndex((aa) => aa.id === a2) + 1;
  //       },
  //       emptyOr: function (a1: any, a2: any = '-') {
  //         return JSON.stringify(a1 ?? '') === '{}' ||
  //           a1 === undefined ||
  //           a1 === null
  //           ? a2
  //           : a1;
  //       },
  //     },
  //   }),
  // );
  // app.setViewEngine('hbs');
  // hbs.registerPartials(
  //   path.join(path.resolve(), 'src', 'views', 'pages', 'partials'),
  // );
  // hbs.registerHelper('ifEquals', function (a1, a2, options) {
  //   return a1 === a2 ? options.fn(this) : options.inverse(this);
  // });

  await app.listen(common.port, common.host, async () => {
    if (module.hot) {
      module.hot.accept();
      module.hot.dispose(() => app.close());
    }

    console.log(`server listening on ${await app.getUrl()}`);
  });
}
bootstrap();
