import { ArgumentsHost, Catch, ExceptionFilter, UnauthorizedException } from '@nestjs/common';
import { Socket } from 'socket.io';

@Catch(UnauthorizedException)
export class WsExceptionFilter implements ExceptionFilter {
    catch(exception: UnauthorizedException, host: ArgumentsHost) {
        const client = host.switchToWs().getClient<Socket>();
        console.log('An unauthorized client tried to connect');
        client.emit('error', 'Invalid token');
    }
}
