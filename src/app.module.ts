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
import { AppController } from './app.controller';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [commonConf] }),
    AuthModule,
    VotesModule,
    PollsModule,
    DatabaseModule,
    UsersModule,
    ServeStaticModule.forRoot({
      rootPath: path.join(path.resolve(), 'views/dist'),
    }),
    BoardsModule,
  ],
  controllers: [AppController],
  providers: [ConfigService, PrismaService, WebsocketGateway],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
