import { Injectable, NestMiddleware } from '@nestjs/common';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';

@Injectable()
export class OpenWeatherProMiddleware implements NestMiddleware {
  private proxy = createProxyMiddleware({
    onProxyReq: fixRequestBody,
    target: `https://pro.openweathermap.org`,
    changeOrigin: true,
    secure: true,
    ws: false,
    pathRewrite: {
        '^/openweatherpro': '/openweatherpro',
      },
  });

  async use(req: any, res: any, next: () => void) {
    this.proxy(req, res, next);
  }
}