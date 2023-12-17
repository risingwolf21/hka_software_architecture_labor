import { MiddlewareConsumer, Module } from '@nestjs/common';
import { BundMiddleware } from './middlewares/bund.middleware';

@Module({})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(BundMiddleware).forRoutes('bund');
  }
}
