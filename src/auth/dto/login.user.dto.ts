import { IsEmail, IsString } from "class-validator";
import { UsersEntity } from "../../users/entities/users.entity";
import { PickType } from "@nestjs/mapped-types";

export class LoginUserDto extends PickType(UsersEntity, ['email', 'password']) {
    @IsEmail({}, {
        message: `이메일 형식이 아닙니다. e.g. @xxxxx.xxx`
    })
    email!: string;

    @IsString()
    password!: string;
}