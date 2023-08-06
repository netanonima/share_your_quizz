import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Quizz } from '../../quizzs/entities/quizz.entity';
import { Choice } from '../../choices/entities/choice.entity';
import { Media } from '../../medias/entities/media.entity';
import { Image } from '../../images/entities/image.entity';

@Entity('question')
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Quizz, (quizz) => quizz.questions)
  quizz: Quizz;

  @Column({ length: 80 })
  question: string;

  @OneToMany(() => Choice, (choice) => choice.question)
  choices: Choice[];

  @OneToMany(() => Media, (media) => media.question)
  medias: Media[];

  @OneToMany(() => Image, (image) => image.question)
  images: Image[];
}
