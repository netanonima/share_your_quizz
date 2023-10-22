// sockets.gateway.ts
import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({namespace: 'play'})
export class PlaySocketsGateway {
    @SubscribeMessage('message')
    handleMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket): string {
        console.log(`Message from client: ${data}`);
        return 'Hello world!';
    }
}
