import { Decimal } from "@prisma/client/runtime/library";
export declare class DecimalNumber extends Decimal {
    constructor(value?: number);
}
export declare class PaymentDTO {
    orderId: number;
    amount: Decimal;
    paymentMethod: string;
    status: string;
    couponCode: string;
}
