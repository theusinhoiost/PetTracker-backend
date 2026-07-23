import { Pet } from 'src/pet/entities/pet.entity';
import { VaccineStatus } from 'src/pet/types/vaccine-status';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Vaccine {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column('date')
  applicationDate!: Date;

  @Column('date', { nullable: true })
  nextDueDate?: Date;

  @Column({
    type: 'enum',
    enum: VaccineStatus,
    default: VaccineStatus.APPLIED,
  })
  status!: VaccineStatus;

  @ManyToOne(() => Pet, (pet) => pet.vaccines, {
    onDelete: 'CASCADE',
  })
  pet!: Pet;

  @CreateDateColumn()
  createdAt!: Date;
}
