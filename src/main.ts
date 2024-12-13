import commonConf from '@common/common.conf';
import whiteList from '@common/whiteList';
import { RequestMethod } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { allowOrigins } from '@utils/allowOrigins';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ResponseInterceptor } from '@middleware/response.interceptor';
import { HttpExceptionFilter } from '@middleware/http-exception.filter';
import { CookieGuard } from '@auth/cookie.guard';

declare const module: any;

// console.log('Current working directory:', process.cwd());
// console.log(
//   'Resolved path for ./auth/auth.module:',
//   require.resolve('./auth/auth.module'),
// );

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
    exclude: [{ path: 'sitemap.xml', method: RequestMethod.GET }],
  });
  app.use(cookieParser());
  app.use(compression());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(common.PORT, common.HOST, async () => {
    if (module.hot) {
      module.hot.accept();
      module.hot.dispose(() => app.close());
    }

    console.log(`server listening on ${await app.getUrl()}`);
  });
}
bootstrap();
