import { Pet } from 'src/pet/entities/pet.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column()
  name!: string;
  @Column({ unique: true })
  email!: string;
  @Column({ select: false })
  password!: string;
  @Column({ unique: true })
  phoneNumber!: string;
  @Column({ default: false })
  forceLogout!: boolean;
  @Column({ default: true })
  isActive!: boolean;
  @Column({ default: 'owner' })
  role!: 'owner' | 'admin';
  @OneToMany(() => Pet, (pet) => pet.owner)
  pets!: Pet[];
  @CreateDateColumn()
  createdAt!: Date;
  @UpdateDateColumn()
  updatedAt!: Date;
}
