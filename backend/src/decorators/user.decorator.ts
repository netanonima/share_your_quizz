import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from "users/entities/user.entity";

export interface RequestUser {
    id: number;
}

export const GetUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): User => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);
