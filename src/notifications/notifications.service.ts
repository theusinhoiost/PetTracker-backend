import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
  ) {}

  async create(data: Partial<Notification>) {
    const notification = this.notificationRepo.create(data);
    return this.notificationRepo.save(notification);
  }

  async findByUser(userId: string) {
    return this.notificationRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(id: string, userId: string) {
    return this.notificationRepo.update({ id, userId }, { read: true });
  }
}
