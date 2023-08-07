import {Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn} from 'typeorm';
import { Quizz } from '../../quizzs/entities/quizz.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 24 })
  username: string;

  @Column({ length: 256 })
  @Exclude()
  password: string;

  @Column({ length: 254 })
  email: string;

  @Column()
  @CreateDateColumn()
  created_on: Date;

  @Column({ nullable: true })
  confirmation_token: string;

  @Column({ nullable: true })
  confirm_before: Date;

  @Column({ nullable: true })
  account_confirmed_on: Date;

  @Column({ nullable: true })
  deleted_on: Date;

  @Column({ default: 0 })
  is_super_admin: boolean;

  @OneToMany(() => Quizz, (quizz) => quizz.user)
  quizzs: Quizz[];
}
