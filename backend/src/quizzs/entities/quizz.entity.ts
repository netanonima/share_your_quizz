import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Question } from '../../questions/entities/question.entity';
import { Session } from '../../sessions/entities/session.entity';
import { Media } from "medias/entities/media.entity";
import { Image } from "images/entities/image.entity";

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

  @OneToOne(() => Media, (media) => media.question)
  medias: Media[];

  @OneToOne(() => Image, (image) => image.question)
  images: Image[];
}
