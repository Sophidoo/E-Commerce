import { IsNotEmpty, IsOptional } from "class-validator"

export class ReviewDTO {
    @IsOptional()
    rating:    number
    @IsOptional()
    feedback  : string
    @IsNotEmpty()
    productId : number
    @IsNotEmpty()
    userId   : number
}