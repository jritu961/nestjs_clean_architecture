// src/users/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}


@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  phone: string;
}
