import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { Vaccine } from 'src/pet/vaccine/entities/vaccine.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, Vaccine])],
  providers: [NotificationsService],
  controllers: [NotificationsController],
  exports: [TypeOrmModule, NotificationsService],
})
export class NotificationsModule {}
