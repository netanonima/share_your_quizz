import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne} from 'typeorm';
import { Question } from '../../questions/entities/question.entity';

@Entity()
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Question, (question) => question.media)
  question: Question;

  @Column({ length: 140 })
  file_path: string;

  @Column({ length: 60 })
  filename: string;

  @Column('float')
  size: number;

  @Column({ length: 70 })
  type: string;

  @Column({ length: 6 })
  extension: string;

  @Column({ nullable: true })
  duration: string;
}
