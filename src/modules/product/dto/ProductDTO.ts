import { $Enums } from "@prisma/client"
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator"

export class ProductDTO {
    @IsNotEmpty()
    @IsString()
    productName : string
    @IsNotEmpty()
    @IsNumber()
    productPrice : number
    @IsNumber()
    @IsNotEmpty()
    quantityAvailable: number
    @IsNotEmpty()
    @IsEnum($Enums.Size)
    size: $Enums.Size
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