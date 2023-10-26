import {UserInterface} from "play-sockets/interfaces/user.interface";

export interface SessionInterface{
    admin: string;
    opened: boolean;
    users: UserInterface[];
    current: number;
    questions: any[];
    ranking: any[];
    questionsRanking: any[];
}