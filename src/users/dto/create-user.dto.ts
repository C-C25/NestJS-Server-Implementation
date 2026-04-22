import { IsString } from "class-validator";

export class CreateUserDto {
    // @Type(()=> Number)
    @IsString()
    email!: string;

    @IsString()
    password!: string;
}