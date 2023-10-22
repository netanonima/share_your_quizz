// sockets.module.ts
import { Module } from '@nestjs/common';
import { PlaySocketsGateway } from './play-sockets.gateway';

@Module({
    providers: [PlaySocketsGateway],
})
export class PlaySocketsModule {}
