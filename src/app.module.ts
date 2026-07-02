import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { PetModule } from './pet/pet.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    PetModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
      synchronize: process.env.DB_SYNCHRONIZE === '1',
      autoLoadEntities: process.env.DB_AUTO_LOAD_ENTITIES === '1',
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 150,
        },
      ],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
