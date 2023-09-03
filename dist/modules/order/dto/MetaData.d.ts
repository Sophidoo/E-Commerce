import { Decimal } from "@prisma/client/runtime/library";
export declare class DecimalNumber extends Decimal {
    constructor(value?: number);
}
export declare class Metadata {
    orderId: number;
    amount: Decimal;
}
