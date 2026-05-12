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
import { Vaccine } from '../vaccine/entities/vaccine.entity';
import { Weight } from '../weight/entities/weight.entity';

@Entity()
export class Pet {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string;

  @Column({ type: 'date' })
  birthDate!: Date;

  @Column()
  race!: string;

  @Column()
  species!: string;

  @ManyToOne(() => User, (user) => user.pets, {
    onDelete: 'CASCADE',
  })
  owner!: User;

  @RelationId((pet: Pet) => pet.owner)
  ownerId!: string;

  @OneToMany(() => Vaccine, (vaccine) => vaccine.pet)
  vaccines!: Vaccine[];

  @OneToMany(() => Weight, (weight) => weight.pet)
  weights!: Weight[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
