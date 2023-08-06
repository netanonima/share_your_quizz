import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Quizz } from '../../quizzs/entities/quizz.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 24 })
  username: string;

  @Column({ length: 256 })
  password: string;

  @Column({ length: 254 })
  email: string;

  @Column()
  created_on: Date;

  @Column({ nullable: true })
  confirmation_token: string;

  @Column({ nullable: true })
  confirm_before: Date;

  @Column()
  account_confirmed_on: Date;

  @Column()
  deleted_on: Date;

  @Column({ default: 0 })
  is_super_admin: boolean;

  @OneToMany(() => Quizz, (quizz) => quizz.user)
  quizzs: Quizz[];
}
