import { $Enums } from "@prisma/client"
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator"

export class EditProductDTO {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    productName : string
    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    productPrice : number
    @IsOptional()
    @IsNumber()
    @IsNotEmpty()
    quantityAvailable: number
    @IsOptional()
    @IsNotEmpty()
    @IsEnum($Enums.Size)
    size: $Enums.Size
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    category : string
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    description: string
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    brand : string
}