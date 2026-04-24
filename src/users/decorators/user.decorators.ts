import { BadRequestException, createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UsersEntity } from "../entities/users.entity";

export const User = createParamDecorator((data: UsersEntity | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest()

    if (req.user === undefined) {
        throw new BadRequestException('');
    };

    return req.user;
})