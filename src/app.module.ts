import { LoggerMiddleware } from '@middleware/logger.middleware';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import commonConf from './common/common.conf';
import { DatabaseModule } from './database/database.module';
import { PollsModule } from './polls/polls.module';
import { VotesModule } from './votes/votes.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from './auth/role.guard';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [commonConf] }),
    AuthModule,
    VotesModule,
    PollsModule,
    DatabaseModule,
    UsersModule,
  ],
  controllers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
