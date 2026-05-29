import { Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { BcryptHashingService } from './hashing/bcrypt-hashing.service';
import { EncryptingService } from './encrypting/encrypting.service';
import { CryptoEncryptingService } from './encrypting/crypto-encrypting.service';
import { S3Module } from './s3/s3.module';

@Module({
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
  exports: [HashingService],
  imports: [S3Module],
})
export class CommonModule {}
