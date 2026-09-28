/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class MetricsTokenGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    if (req.path !== '/metrics') return true;
    if (process.env.NODE_ENV !== 'production') return true;
    return req.headers['x-metrics-token'] === process.env.METRICS_TOKEN;
  }
}
