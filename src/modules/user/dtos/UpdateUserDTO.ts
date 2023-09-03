import { ApiPropertyOptional } from "@nestjs/swagger"
import { $Enums } from "@prisma/client"
import { IsNotEmpty, IsOptional } from "class-validator"

export class UpdateUserDTO{
    @IsOptional()
    @IsNotEmpty()
    @ApiPropertyOptional()
    firstname: string
    @IsOptional()
    @IsNotEmpty()
    @ApiPropertyOptional()
    lastname: string
    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    username: string
    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    phoneNumber: string
    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    dateOfBirth: Date
    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    gender: string
}