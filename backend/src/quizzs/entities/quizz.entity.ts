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

  @Column({ length: 80 })
  quizz: string;

  @Column()
  created_on: Date;

  @Column({nullable: true})
  modified_on: Date;

  @OneToMany(() => Question, (question) => question.quizz, { cascade: true })
  questions: Question[];

  @OneToMany(() => Session, (session) => session.quizz)
  sessions: Session[];

  @Column({ default: false })
  param_shuffle_questions: boolean;

  @Column({ default: false })
  param_shuffle_choices: boolean;
}
