import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Question } from '../../questions/entities/question.entity';

@Entity()
export class Choice {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Question, (question) => question.choices)
  question: Question;

  @Column({ length: 40 })
  choice: string;

  @Column()
  is_correct: boolean;
}
