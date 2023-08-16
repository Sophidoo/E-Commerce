import {IsEmpty, IsEmail, IsString, IsNotEmpty} from "class-validator"

export class LoginDTO {
    @IsNotEmpty()
    @IsString()
    usernameOrEmail: string

    @IsNotEmpty()
    @IsString()
    password: string
}