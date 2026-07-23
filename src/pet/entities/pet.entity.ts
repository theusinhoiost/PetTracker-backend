import { User } from 'src/user/entities/user.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { PetSpecies } from '../types/pet-species';
import { Vaccine } from '../vaccine/entities/vaccine.entity';
import { Weight } from '../weight/entities/weight.entity';

@Entity()
export class Pet {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'date' })
  birthDate!: Date;

  @Column()
  race!: string;

  @Column({
    type: 'enum',
    enum: PetSpecies,
  })
  species!: PetSpecies;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  imageKey: string | null = null;

  @ManyToOne(() => User, (user) => user.pets, {
    onDelete: 'CASCADE',
  })
  owner!: User;

  @RelationId((pet: Pet) => pet.owner)
  ownerId!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  notes?: string;

  @OneToMany(() => Vaccine, (vaccine) => vaccine.pet, {
    cascade: false,
  })
  vaccines!: Vaccine[];

  @OneToMany(() => Weight, (weight) => weight.pet, {
    cascade: false,
  })
  weights!: Weight[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
