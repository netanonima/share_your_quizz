// sockets.module.ts
import { Module } from '@nestjs/common';
import { PlaySocketsGateway } from './play-sockets.gateway';
import {AuthModule} from "auth/auth.module";

@Module({
    imports: [
        AuthModule
    ],
    providers: [PlaySocketsGateway],
})
export class PlaySocketsModule {}
