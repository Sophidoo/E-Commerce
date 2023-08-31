

import { DeliveryType } from "@prisma/client"
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator"


export class CheckoutDTO{
    @IsOptional()
    streetAddress : string
    @IsOptional()
    city   : string     
    @IsOptional()            
    state  : string     
    @IsOptional()          
    country   : string 
    @IsOptional()
    useDefaultShippingAddress: boolean
    @IsOptional()
    coupon : string  
    @IsOptional()
    deliveryType : DeliveryType
}