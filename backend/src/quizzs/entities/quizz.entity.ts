import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Question } from '../../questions/entities/question.entity';
import { Session } from '../../sessions/entities/session.entity';

@Entity()
export class Quizz {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.quizzs)
  user: User;

  @Column()
  created_on: Date;

  @Column()
  modified_on: Date;

  @Column()
  deleted_on: Date;

  @OneToMany(() => Question, (question) => question.quizz)
  questions: Question[];

  @OneToMany(() => Session, (session) => session.quizz)
  sessions: Session[];
}
