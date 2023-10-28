import {ChoiceInterface} from "./choice.interface";

export interface QuestionInterface {
  question: string;
  choices: ChoiceInterface[];
}
