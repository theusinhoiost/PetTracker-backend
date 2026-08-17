import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Notification, NotificationType } from './entities/notification.entity';
import { Vaccine } from 'src/pet/vaccine/entities/vaccine.entity';
import { VaccineStatus } from 'src/pet/types/vaccine-status';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
    @InjectRepository(Vaccine)
    private readonly vaccineRepo: Repository<Vaccine>,
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

  async countUnread(userId: string): Promise<number> {
    return this.notificationRepo.count({
      where: { userId, read: false },
    });
  }

  async markAllAsRead(userId: string) {
    return this.notificationRepo.update(
      { userId, read: false },
      { read: true },
    );
  }

  // =====================================================
  // CRON - Avisos de vacina
  // =====================================================
  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async checkVaccineReminders() {
    const vaccines = await this.vaccineRepo.find({
      where: {
        nextDueDate: Not(IsNull()),
      },
      relations: ['pet'],
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const vaccine of vaccines) {
      if (!vaccine.nextDueDate || !vaccine.pet) continue;

      const dueDate = new Date(vaccine.nextDueDate);
      dueDate.setHours(0, 0, 0, 0);

      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let title = '';
      let message = '';

      // Vacina vencida
      if (diffDays < 0) {
        title = 'Vacina vencida';
        message = `A vacina ${vaccine.vaccineName} de ${vaccine.pet.name} está vencida.`;

        if (vaccine.status !== VaccineStatus.OVERDUE) {
          vaccine.status = VaccineStatus.OVERDUE;
          await this.vaccineRepo.save(vaccine);
        }
      }
      // Falta 1 dia
      else if (diffDays === 1) {
        title = 'Vacina vence amanhã';
        message = `A vacina ${vaccine.vaccineName} de ${vaccine.pet.name} vence amanhã.`;
      }
      // Falta 7 dias
      else if (diffDays === 7) {
        title = 'Vacina vence em 7 dias';
        message = `A vacina ${vaccine.vaccineName} de ${vaccine.pet.name} vence em 7 dias.`;
      } else {
        continue;
      }

      const alreadyExists = await this.notificationRepo.findOne({
        where: {
          referenceId: vaccine.id,
          type: NotificationType.VACCINE_REMINDER,
          title,
        },
      });

      if (alreadyExists) continue;

      await this.create({
        userId: vaccine.pet.ownerId,
        petId: vaccine.pet.id,
        type: NotificationType.VACCINE_REMINDER,
        title,
        message,
        referenceId: vaccine.id,
        read: false,
      });
    }
  }
}
