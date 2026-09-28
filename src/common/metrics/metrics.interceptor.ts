/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { MetricsService } from './metrics.service';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(private metrics: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const res = context.switchToHttp().getResponse();
        const route = req.route?.path || req.url;
        const labels = { method: req.method, route };

        this.metrics.httpRequestsTotal.inc({
          ...labels,
          status: res.statusCode,
        });
        this.metrics.httpRequestDuration.observe(
          labels,
          (Date.now() - start) / 1000,
        );
      }),
    );
  }
}
