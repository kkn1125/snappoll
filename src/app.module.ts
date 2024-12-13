import { AuthModule } from '@auth/auth.module';
import { CustomThrottlerGuard } from '@auth/custom.throttler.guard';
import { BoardsModule } from '@boards/boards.module';
import commonConf from '@common/common.conf';
import emailConf from '@common/email.conf';
import { DatabaseModule } from '@database/database.module';
import { PrismaService } from '@database/prisma.service';
import { LoggerMiddleware } from '@middleware/logger.middleware';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MulterModule } from '@nestjs/platform-express';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerModule } from '@nestjs/throttler';
import { PollsModule } from '@polls/polls.module';
import { UsersModule } from '@users/users.module';
import { VotesModule } from '@votes/votes.module';
import { WebsocketGateway } from '@websocket/websocket.gateway';
import path from 'path';
import { BasicModule } from './basic/basic.module';
import { MailerModule } from './mailer/mailer.module';
import { CookieGuard } from '@auth/cookie.guard';

@Module({
  imports: [
    MulterModule.register({
      dest: './upload',
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20,
      },
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true, load: [commonConf, emailConf] }),
    MailerModule,
    BasicModule,
    AuthModule,
    VotesModule,
    PollsModule,
    DatabaseModule,
    UsersModule,
    ServeStaticModule.forRoot({
      rootPath: path.join(path.resolve(), 'views/dist'),
      exclude: ['/sitemap.xml'],
    }),
    BoardsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CookieGuard,
    },
    { provide: APP_GUARD, useClass: CustomThrottlerGuard },
    ConfigService,
    PrismaService,
    WebsocketGateway,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
