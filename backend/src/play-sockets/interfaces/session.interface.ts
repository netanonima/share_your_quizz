import {UserInterface} from "play-sockets/interfaces/user.interface";

export interface SessionInterface{
    admin: string;
    users: UserInterface[];
}