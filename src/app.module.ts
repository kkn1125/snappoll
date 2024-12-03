import { LoggerMiddleware } from '@middleware/logger.middleware';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import path from 'path';
import { AuthModule } from './auth/auth.module';
import commonConf from './common/common.conf';
import { DatabaseModule } from './database/database.module';
import { PollsModule } from './polls/polls.module';
import { UsersModule } from './users/users.module';
import { VotesModule } from './votes/votes.module';
import { WebsocketGateway } from './websocket/websocket.gateway';
import { PrismaService } from '@database/prisma.service';
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
  ],
  controllers: [],
  providers: [PrismaService, WebsocketGateway],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
