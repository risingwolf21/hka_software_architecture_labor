import { MiddlewareConsumer, Module } from '@nestjs/common';
import { BundMiddleware } from './middlewares/bund.middleware';
import { OpenWeatherMiddleware } from './middlewares/openweather.middleware';
import { OpenWeatherProMiddleware } from './middlewares/openweather.pro.middleware';

@Module({})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(BundMiddleware).forRoutes('bund');
    consumer.apply(OpenWeatherMiddleware).forRoutes('openweather');
    consumer.apply(OpenWeatherProMiddleware).forRoutes('openweatherpro');
  }
}
