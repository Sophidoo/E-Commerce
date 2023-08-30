import { IsNotEmpty, IsOptional } from "class-validator"

export class ReviewDTO {
    @IsNotEmpty()
    rating:    number
    @IsOptional()
    feedback  : string
}