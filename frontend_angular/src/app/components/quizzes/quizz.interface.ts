export interface Quizz {
  id: number;
  quizz: string;
  created_on: Date;
  modified_on: Date;
  param_shuffle_questions: boolean;
  param_shuffle_choices: boolean;
}
