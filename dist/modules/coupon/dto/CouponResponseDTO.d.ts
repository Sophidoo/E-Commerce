import { Decimal } from "@prisma/client/runtime/library";
export declare class DecimalNumber extends Decimal {
    constructor(value?: number);
}
export declare class CouponResponseDTO {
    id: number;
    couponCode: string;
    discountPercentage: number;
    expiryDate: Date;
}
