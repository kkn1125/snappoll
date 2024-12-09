import { AuthModule } from '@auth/auth.module';
import { BoardsModule } from '@boards/boards.module';
import commonConf from '@common/common.conf';
import { DatabaseModule } from '@database/database.module';
import { PrismaService } from '@database/prisma.service';
import { LoggerMiddleware } from '@middleware/logger.middleware';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PollsModule } from '@polls/polls.module';
import { UsersModule } from '@users/users.module';
import { VotesModule } from '@votes/votes.module';
import { WebsocketGateway } from '@websocket/websocket.gateway';
import path from 'path';
import { BasicModule } from './basic/basic.module';
import { MailerModule } from './mailer/mailer.module';
import emailConf from '@common/email.conf';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
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
  providers: [ConfigService, PrismaService, WebsocketGateway],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
