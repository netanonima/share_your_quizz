import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany, OneToOne, JoinColumn,
} from 'typeorm';
import { Quizz } from '../../quizzs/entities/quizz.entity';
import { Choice } from '../../choices/entities/choice.entity';
import { Media } from '../../medias/entities/media.entity';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Quizz, (quizz) => quizz.questions)
  quizz: Quizz;

  @Column({ length: 80 })
  question: string;

  @OneToMany(() => Choice, (choice) => choice.question, { cascade: true })
  choices: Choice[];

  @OneToOne(() => Media, (media) => media.question, { cascade: true })
  @JoinColumn()
  media: Media;
}
