import { IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator"
import { isNumberObject } from "util/types"


export class CouponDTO {
    @IsNotEmpty()
    @IsString()
    couponCode : string
    @IsNotEmpty()
    discountPercentage : number
    @IsNotEmpty()
    expiryDate : Date
}

export class EditCouponDTO {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    couponCode : string
    @IsOptional()
    @IsNotEmpty()
    discountPercentage : number
    @IsOptional()
    @IsNotEmpty()
    expiryDate : Date
}