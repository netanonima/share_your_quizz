import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { JwtService } from "@nestjs/jwt";
import { TokenExpiredError } from 'jsonwebtoken';
import { jwtConstants } from "auth/constants";

@Injectable()
export class WsJwtGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const client = context.switchToWs().getClient();
        const token = client.handshake.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            const decoded = this.jwtService.verify(token, { secret: jwtConstants.secret });
            console.log(decoded);
            return true;
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                throw new UnauthorizedException('Token expiré');
            } else {
                throw new UnauthorizedException('Token invalide');
            }
        }
    }
}
