import { Module } from '@nestjs/common';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { HashingService } from './hashing/hashing.service';
import { BcryptHashingService } from './hashing/bcrypt-hashing.service';
import { EncryptingService } from './encrypting/encrypting.service';
import { CryptoEncryptingService } from './encrypting/crypto-encrypting.service';
import { S3Module } from './s3/s3.module';

@Module({
  imports: [
    S3Module,
    PrometheusModule.register({
      path: '/metrics',
      defaultMetrics: {
        enabled: true,
      },
    }),
  ],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptHashingService,
    },
    {
      provide: EncryptingService,
      useClass: CryptoEncryptingService,
    },
  ],
  exports: [HashingService, EncryptingService],
})
export class CommonModule {}
