// sockets.gateway.ts
import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import {JoinInterface} from "play-sockets/interfaces/join.interface";
import {UserInterface} from "play-sockets/interfaces/user.interface";
import {SessionInterface} from "play-sockets/interfaces/session.interface";
import {UseGuards} from "@nestjs/common";
import {WsJwtGuard} from "play-sockets/guards/ws-jwt.guard";

@WebSocketGateway({namespace: 'play'})
export class PlaySocketsGateway {
    private sessions = new Map<number, SessionInterface>();

    @UseGuards(WsJwtGuard)
    @SubscribeMessage('admin-join')
    maMethode() {
        console.log('admin-join');
    }

    @SubscribeMessage('join')
    handleJoin(@MessageBody() data: JoinInterface, @ConnectedSocket() client: Socket): void {
        const { sessionId, username } = data;

        if (!this.sessions.has(sessionId)) {
            this.sessions.set(sessionId, { admin: '', users: [] });
        }

        const session = this.sessions.get(sessionId);

        if (session.users.some(user => user.username === username)) {
            client.emit('joinResponse', `Username "${username}" already exists in this session.`);
            return;
        }
        if (session.users.some(user => user.id === client.id)) {
            client.emit('joinResponse', `Client id "${client.id}" already exists in this session.`);
            return;
        }

        const user: UserInterface = { id: client.id, username };
        session.users.push(user);

        console.log(`User ${username} joined session ${sessionId}`);
        console.log('Session state:', this.sessions);
        console.log('Session users:', session.users);
        client.emit('joinResponse', `Welcome ${username}!`);
    }

    // todo: créer guard qui contrôle le token pour attribuer l'accès aux subscribes admin
    // todo: Créer subscribe pour stocker le client.id de l'admin dans la session
    // todo: Envoyer un message à l'admin quand un nouveau joueur rejoint la session
    // todo: Envoyer un message à l'admin quand un joueur quitte la session + supprimer le joueur de la session
}
