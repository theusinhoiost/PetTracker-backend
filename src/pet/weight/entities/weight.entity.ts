import { Pet } from 'src/pet/entities/pet.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Weight {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column('float')
  value!: number;
  @ManyToOne(() => Pet, (pet) => pet.weights, {
    onDelete: 'CASCADE',
  })
  pet!: Pet;
  @Column('date')
  measurementDay!: Date;

  @CreateDateColumn()
  createdAt!: Date;
}
