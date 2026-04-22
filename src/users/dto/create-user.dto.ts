import { Type } from "class-transformer";
import { IsEmail, IsString } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    email!: string;

    @Type(() => String)
    @IsString()
    password!: string;

    @Type(() => String)
    @IsString()
    nickname!: string;
}