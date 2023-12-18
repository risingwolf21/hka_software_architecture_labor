import { Injectable, NestMiddleware } from '@nestjs/common';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';

@Injectable()
export class BundMiddleware implements NestMiddleware {
  private proxy = createProxyMiddleware({
    onProxyReq: fixRequestBody,
    target: `https://dwd.api.proxy.bund.dev`,
    changeOrigin: true,
    secure: true,
    ws: false,
    pathRewrite: {
      '^/bund': '/',
    },
  });

  async use(req: any, res: any, next: () => void) {
    this.proxy(req, res, next);
  }
}
