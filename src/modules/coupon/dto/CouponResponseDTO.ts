import { Exclude, Expose } from "class-transformer"

@Exclude()
export class CouponResponseDTO {
    @Expose()
    id: number
    @Expose()
    couponCode : string
    @Expose()
    discountPercentage : number
    @Expose()
    expiryDate : Date
}