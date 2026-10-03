import { Injectable } from '@nestjs/common';
import * as client from 'prom-client';

@Injectable()
export class MetricsService {
  // já coletas do Node (CPU, mem, event loop)
  constructor() {
    client.collectDefaultMetrics({ prefix: 'pettracker_' });
  }

  public httpRequestsTotal = new client.Counter({
    name: 'http_requests_total',
    help: 'Total HTTP requests',
    labelNames: ['method', 'route', 'status'] as const,
  });

  public httpRequestDuration = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route'] as const,
    buckets: [0.05, 0.1, 0.3, 0.5, 1, 1.5, 2, 5],
  });

  // bônus pra PetTracker - já deixa pronto pro dashboard V2
  public petsCreatedTotal = new client.Counter({
    name: 'pettracker_pets_created_total',
    help: 'Total pets created',
  });

  public trackersOnline = new client.Gauge({
    name: 'pettracker_trackers_online',
    help: 'Trackers online',
  });

  async getMetrics() {
    return client.register.metrics();
  }
}
