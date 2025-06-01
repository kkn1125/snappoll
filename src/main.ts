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
import { AppModule } from './app.module';
import SnapLoggerService from '@logger/logger.service';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

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
  const snapLoggerService = app.get(SnapLoggerService);
  const logger = new SnapLoggerService('bootstrap');
  // app.useLogger(new SnapLogger());
  const { hosts, ports } = whiteList;
  const configService = app.get(ConfigService);
  const common = configService.get<ConfigType<typeof commonConf>>('common');

  const allowList = allowOrigins(hosts, ports);

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
      // {
      //   path: 'preview(.*)',
      //   method: RequestMethod.GET,
      // },
      // {
      //   path: 'manage(.*)',
      //   method: RequestMethod.ALL,
      // },
    ],
  });
  app.use(cookieParser());
  app.use(compression());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter(snapLoggerService));

  const config = new DocumentBuilder()
    .setTitle('SnapPoll API')
    .setDescription('SnapPoll API Description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      docExpansion: 'none',
    },
  });

  await app.listen(common.port, common.host, async () => {
    if (module.hot) {
      module.hot.accept();
      module.hot.dispose(() => app.close());
    }

    logger.info('allowList:', allowList);
    logger.info(`server listening on ${await app.getUrl()}`);
  });
}
bootstrap();
