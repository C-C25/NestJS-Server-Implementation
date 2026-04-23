import { PickType } from "@nestjs/mapped-types";
import { UsersEntity } from "../../users/entities/users.entity";
import { IsEmail, IsString, Length } from "class-validator";

export class RegisterUserDto extends PickType(UsersEntity, ['email', 'nickname', 'password']) {
    @IsEmail({}, {
        message: `이메일 형식이 아닙니다. e.g. @xxxxx.xxx`
    })
    email!: string;

    @IsString()
    @Length(3, 8)
    password!: string;

    @IsString()
    @Length(2)
    nickname!: string;
}