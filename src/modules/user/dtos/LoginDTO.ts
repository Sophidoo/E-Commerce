import { ApiBody, ApiProperty } from "@nestjs/swagger"
import {IsEmpty, IsEmail, IsString, IsNotEmpty} from "class-validator"

export class LoginDTO {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    usernameOrEmail: string
    
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    password: string
}