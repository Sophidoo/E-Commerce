import { Decimal } from "@prisma/client/runtime/library";
import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional } from "class-validator";


export class DecimalNumber extends Decimal {
    constructor(value = 0) { super(value); }
}

export class PaymentDTO{
    @IsNotEmpty()
    orderId  : number
    @IsNotEmpty()
    @Type(() => DecimalNumber)
    amount  : Decimal
    @IsNotEmpty()
    paymentMethod: string
    @IsNotEmpty()
    status: string
    @IsOptional()
    couponCode : string
}