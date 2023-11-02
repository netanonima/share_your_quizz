import {ResultInterface} from "./result.interface";
import {AnswerDistributionInterface} from "./answer-distribution.interface";

export interface ResultsInterface{
  thisQuestionResult: ResultInterface,
  result: ResultInterface,
  answerDistribution: [AnswerDistributionInterface]
}
