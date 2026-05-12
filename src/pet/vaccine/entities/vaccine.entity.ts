import { Pet } from 'src/pet/entities/pet.entity';
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

  @Column({ type: 'date' })
  applicationDate!: Date;

  @ManyToOne(() => Pet, (pet) => pet.vaccines, {
    onDelete: 'CASCADE',
  })
  pet!: Pet;

  @CreateDateColumn()
  createdAt!: Date;
}
