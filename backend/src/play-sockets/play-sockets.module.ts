// sockets.module.ts
import { Module } from '@nestjs/common';
import { PlaySocketsGateway } from './play-sockets.gateway';
import {AuthModule} from "auth/auth.module";
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        AuthModule,
        ConfigModule.forRoot({})
    ],
    providers: [PlaySocketsGateway],
})
export class PlaySocketsModule {}
