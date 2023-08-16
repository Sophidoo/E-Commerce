import {IsEmpty, IsEmail} from "class-validator"

export class LoginDTO {
    @IsEmpty()
    @IsEmail()
    usernameOrEmail: string

    @IsEmpty()
    password: string
}