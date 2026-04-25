import { Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { BcryptHashingService } from './hashing/bcrypt-hashing.service';
import { EncryptingService } from './encrypting/encrypting.service';
import { CryptoEncryptingService } from './encrypting/crypto-encrypting.service';

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
})
export class CommonModule {}
