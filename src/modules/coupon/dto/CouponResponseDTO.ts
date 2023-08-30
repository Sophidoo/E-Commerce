import { Decimal } from "@prisma/client/runtime/library";
import { Exclude, Expose, Type } from "class-transformer"

export class DecimalNumber extends Decimal {
    constructor(value = 0) { super(value); }
}

@Exclude()
export class CouponResponseDTO {
    @Expose()
    id: number
    @Expose()
    couponCode : string
    @Expose()
    @Type(() => DecimalNumber)
    discountPercentage : number
    @Expose()
    expiryDate : Date
}