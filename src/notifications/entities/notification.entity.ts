import { Pet } from 'src/pet/entities/pet.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export enum NotificationType {
  VACCINE_REMINDER = 'vaccine_reminder',
  // você pode adicionar outros depois: WEIGHT_ALERT, APPOINTMENT, etc.
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ type: 'uuid', nullable: true })
  petId!: string | null;

  @ManyToOne(() => Pet, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'petId' })
  pet!: Pet | null;

  @Column({ type: 'varchar', length: 50 })
  type!: NotificationType;

  @Column({ type: 'varchar', length: 150 })
  title!: string;

  @Column({ type: 'text' })
  message!: string;

  // ID da vacina (ou de qualquer outra entidade de referência)
  @Column({ type: 'uuid', nullable: true })
  referenceId!: string | null;

  @Column({ type: 'boolean', default: false })
  read!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
