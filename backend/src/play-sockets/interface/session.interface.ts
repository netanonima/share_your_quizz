import {UserInterface} from "play-sockets/interface/user.interface";

export interface SessionInterface{
    admin: string;
    users: UserInterface[];
}