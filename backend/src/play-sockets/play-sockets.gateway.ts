// sockets.gateway.ts
import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import {JoinInterface} from "play-sockets/interfaces/join.interface";
import {UserInterface} from "play-sockets/interfaces/user.interface";
import {SessionInterface} from "play-sockets/interfaces/session.interface";
import {UnauthorizedException, UseFilters, UseGuards} from "@nestjs/common";
import {WsJwtGuard} from "play-sockets/guards/ws-jwt.guard";
import {WsExceptionFilter} from "play-sockets/filters/ws-exception.filter";
import {AdminJoinInterface} from "play-sockets/interfaces/admin-join.interface";

@UseFilters(new WsExceptionFilter())
@WebSocketGateway({namespace: 'play'})
export class PlaySocketsGateway {
    private sessions = new Map<number, SessionInterface>();

    @UseGuards(WsJwtGuard)
    @SubscribeMessage('admin-join')
    handleAdminJoin(@MessageBody() data: AdminJoinInterface, @ConnectedSocket() client: Socket): void {
        console.log('admin-join');
        const { sessionId } = data;
        // add client id to session
        if (!this.sessions.has(sessionId)) {
            this.sessions.set(sessionId, { admin: '', users: [] });
        }
        const session = this.sessions.get(sessionId);
        session.admin = client.id;
        console.log('Session state:', this.sessions);

        client.emit('admin-join-response', 'Welcome admin!');
    }

    @SubscribeMessage('join')
    handleJoin(@MessageBody() data: JoinInterface, @ConnectedSocket() client: Socket): void {
        const { sessionId, username } = data;

        if (!this.sessions.has(sessionId)) {
            this.sessions.set(sessionId, { admin: '', users: [] });
        }

        const session = this.sessions.get(sessionId);

        if (session.users.some(user => user.username === username)) {
            client.emit('join-response', `Username "${username}" already exists in this session.`);
            return;
        }
        if (session.users.some(user => user.id === client.id)) {
            client.emit('join-response', `Client id "${client.id}" already exists in this session.`);
            return;
        }

        const user: UserInterface = { id: client.id, username };
        session.users.push(user);

        console.log(`User ${username} joined session ${sessionId}`);
        console.log('Session state:', this.sessions);
        console.log('Session users:', session.users);
        client.emit('join-response', `Welcome ${username}!`);

        // send message to admin
        const admin = this.sessions.get(sessionId).admin;
        if (admin) {
            client.to(admin).emit('new-player', user.username);
        }
    }

    @SubscribeMessage('disconnect')
    handleDisconnect(@ConnectedSocket() client: Socket): void {
        console.log(`Client disconnected: ${client.id}`);

        this.sessions.forEach((session, sessionId) => {
            const userIndex = session.users.findIndex(user => user.id === client.id);
            if (userIndex !== -1) {
                const username = session.users[userIndex].username;
                console.log(`User ${username} left session ${sessionId}`);
                session.users.splice(userIndex, 1);
                if (session.admin) {
                    client.to(session.admin).emit('player-left', username);
                }
            }

            if (session.admin === client.id) {
                console.log(`Admin of session ${sessionId} disconnected`);
                session.admin = '';
                session.users.forEach(user => {
                    client.to(user.id).emit('error', `Admin just left the session`);
                });
            }
        });

        console.log('Session state after disconnect:', this.sessions);
    }
}
