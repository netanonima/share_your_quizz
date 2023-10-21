import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Quizz } from '../../quizzs/entities/quizz.entity';

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Quizz, (quizz) => quizz.sessions)
  quizz: Quizz;

  @Column()
  started_on: Date;

  @Column({ nullable: true })
  finished_on: Date;

  @Column({ nullable: true, length: 24 })
  winner_username: string;

  @Column({ nullable: true })
  winner_points: number;
}
