import {UserInterface} from "play-sockets/interfaces/user.interface";

export interface SessionInterface{
    admin: string;
    opened: boolean;
    users: UserInterface[];
    current: number;
    questions: any[];
    ranking: { players: { username: string; currentScore: number; }[] };
    questionsRanking: any[];
}