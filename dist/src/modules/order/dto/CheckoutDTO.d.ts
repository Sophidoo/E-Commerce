import { DeliveryType } from "@prisma/client";
export declare class CheckoutDTO {
    streetAddress: string;
    city: string;
    state: string;
    country: string;
    useDefaultShippingAddress: boolean;
    coupon: string;
    deliveryType: DeliveryType;
}
