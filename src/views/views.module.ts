import { PrismaService } from '@database/prisma.service';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ViewsController } from './views.controller';
import { ViewsService } from './views.service';
import { MethodOverrideMiddleware } from './method-override.middleware';

@Module({
  controllers: [ViewsController],
  providers: [PrismaService, ViewsService],
})
export class ViewsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MethodOverrideMiddleware)
      .forRoutes({ path: 'manage/*', method: RequestMethod.POST });
  }
}
