/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class MetricsTokenGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();

    if (req.path !== '/metrics' && req.url !== '/metrics') return true;
    if (process.env.NODE_ENV !== 'production') return true;

    const expected = process.env.METRICS_TOKEN;
    if (!expected) return false;

    const tokenHeader = req.headers['x-metrics-token'] as string | undefined;
    const authHeader = req.headers['authorization'] as string | undefined;
    const bearer = authHeader?.startsWith('Bearer ')
      ? authHeader.replace('Bearer ', '')
      : undefined;

    return tokenHeader === expected || bearer === expected;
  }
}
