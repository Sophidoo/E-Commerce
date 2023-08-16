import { IsEmail, IsString, IsNotEmpty, IsStrongPassword, MinLength } from "class-validator";


export class RegisterDTO{
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsEmail()
    email: string;

    @IsStrongPassword()
    @MinLength(6 ,{message: "Password must be up to 6 characters"})
    @IsString()
    @IsNotEmpty()

    password: string;
}