import {UserInterface} from "play-sockets/interfaces/user.interface";
import {AnswerDistributionInterface} from "play-sockets/interfaces/answer-distribution.interface";

export interface SessionInterface{
    admin: string;
    opened: boolean;
    users: UserInterface[];
    current: number;
    questions: any[];
    ranking: { players: { username: string; currentScore: number; }[] };
    questionsRanking: any[];
    answersDistribution: any[];
}