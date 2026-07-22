import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/auth/enum/user-role.enum';
import { Pet } from 'src/pet/entities/pet.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
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
  @ApiProperty({ example: 'Luiz', description: 'The user name' })
  name!: string;
  @Column({ unique: true })
  email!: string;
  @Column({ select: false })
  password!: string;
  @Column({ unique: true })
  phone!: string;
  @Column({ default: false })
  forceLogout!: boolean;
  @Column({ default: true })
  isActive!: boolean;
  @Column({
    nullable: true,
  })
  hashedRefreshToken!: string;
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role!: UserRole;
  @OneToMany(() => Pet, (pet) => pet.owner)
  pets!: Pet[];
  @CreateDateColumn()
  createdAt!: Date;
  @UpdateDateColumn()
  updatedAt!: Date;
  @DeleteDateColumn({ nullable: true })
  deletedAt!: Date | null;
}
