import { $Enums, AuditAction } from "@prisma/client"
import { IsDate, IsEnum, IsJSON, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"
import { UserResponseDTO } from "src/modules/user/dtos/UserResponseDTO"


export class AuditDTO{
    @IsNotEmpty()
    @IsEnum(AuditAction)
    action: $Enums.AuditAction
    @IsNotEmpty()
    @IsDate()
    createdAt: Date
    @IsNumber()
    @IsNotEmpty()
    userId: number
    @IsNumber()
    @IsNotEmpty()
    recordId: number
    @IsString()
    @IsNotEmpty()
    tableName: string
    @IsJSON()
    oldData: object
    @IsJSON()
    newData: object
}