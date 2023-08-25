import { $Enums } from "@prisma/client"
import { IsNotEmpty, IsOptional } from "class-validator"

export class UpdateUserDTO{
    @IsOptional()
    @IsNotEmpty()
    firstname: string
    @IsOptional()
    @IsNotEmpty()
    lastname: string
    @IsOptional()
    @IsNotEmpty()
    username: string
    @IsOptional()
    @IsNotEmpty()
    phoneNumber: string
    @IsOptional()
    @IsNotEmpty()
    dateOfBirth: Date
    @IsOptional()
    @IsNotEmpty()
    gender: string
}