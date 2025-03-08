import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Optional } from '@nestjs/common';

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;
  
  @Optional()
  @Column()
  url: string;

  @Column()
  mimetype: string;

  @Column({ nullable: true })
  path: string; // Path to the stored file

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.documents)
  user: User;
}
