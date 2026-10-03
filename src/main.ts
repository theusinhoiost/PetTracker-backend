import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { MetricsTokenGuard } from './common/metrics/metrics-token.guard';
import { MetricsInterceptor } from './common/metrics/metrics.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ====================== Helmet ======================
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          fontSrc: ["'self'", 'https:'],
          objectSrc: ["'none'"],
        },
      },
      crossOriginResourcePolicy: { policy: 'same-origin' },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      referrerPolicy: { policy: 'no-referrer' },
    }),
  );

  // ====================== METRICS - ORDEM IMPORTA ======================
  // 1. Pega o interceptor do container (já com MetricsService injetado)
  const metricsInterceptor = app.get(MetricsInterceptor);
  app.useGlobalInterceptors(metricsInterceptor);

  // 2. Guard de metrics (deixa global mesmo, mas ele precisa liberar /metrics com token)
  // Se seu guard usa @Injectable, melhor pegar do container tbm:
  // const metricsGuard = app.get(MetricsTokenGuard);
  // app.useGlobalGuards(metricsGuard);
  // Por enquanto mantém o new se ele não tem dependência:
  app.useGlobalGuards(new MetricsTokenGuard());

  // ====================== CORS ======================
  app.enableCors({
    origin: ['http://localhost:3000', 'https://pet-tracker-web.vercel.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'UPDATE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // ====================== Outras configs ====
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(cookieParser());

  // ====================== Swagger ======================
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('PetTracker')
      .setDescription('The PetTracker API description')
      .setVersion('1.0')
      .build();

    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);
  }

  await app.listen(process.env.PORT ?? 3001);
}

void bootstrap();
