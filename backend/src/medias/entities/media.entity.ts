import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Question } from '../../questions/entities/question.entity';

@Entity()
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Question, (question) => question.medias)
  question: Question;

  @Column({ length: 60 })
  file_path: string;

  @Column({ length: 40 })
  filename: string;

  @Column('bigint')
  size: number;

  @Column({ length: 70 })
  type: string;

  @Column({ length: 6 })
  extension: string;
}
