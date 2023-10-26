// sockets.module.ts
import { Module } from '@nestjs/common';
import { PlaySocketsGateway } from './play-sockets.gateway';
import {AuthModule} from "auth/auth.module";
import {UsersModule} from "users/users.module";
import {SessionsModule} from "sessions/sessions.module";
import {QuizzsModule} from "quizzs/quizzs.module";

@Module({
    imports: [
        AuthModule,
        UsersModule,
        SessionsModule,
        QuizzsModule,
    ],
    providers: [PlaySocketsGateway],
})
export class PlaySocketsModule {}
