import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, IsNotEmpty, IsStrongPassword, MinLength } from "class-validator";


export class RegisterDTO{
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    username: string;
    
    @ApiProperty()
    @IsEmail()
    email: string;
    
    @ApiProperty()
    @IsStrongPassword()
    @MinLength(6 ,{message: "Password must be up to 6 characters"})
    @IsString()
    @IsNotEmpty()

    password: string;
}