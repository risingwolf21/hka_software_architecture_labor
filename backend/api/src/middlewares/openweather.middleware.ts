import { Injectable, NestMiddleware } from '@nestjs/common';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';

@Injectable()
export class OpenWeatherMiddleware implements NestMiddleware {
  private proxy = createProxyMiddleware({
    onProxyReq: fixRequestBody,
    target: `https://api.openweathermap.org`,
    changeOrigin: true,
    secure: true,
    ws: false,
    pathRewrite: {
        '^/openweather': '/',
      },
  });

  async use(req: any, res: any, next: () => void) {
    this.proxy(req, res, next);
  }
}