import { Controller, Get, Res } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import express from 'express';

@Controller()
export class MetricsController {
  constructor(private readonly metrics: MetricsService) {}

  @Get('metrics')
  async getMetrics(@Res() res: express.Response) {
    res.set('Content-Type', 'text/plain');
    res.send(await this.metrics.getMetrics());
  }
}
