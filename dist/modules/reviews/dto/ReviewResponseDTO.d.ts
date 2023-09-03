import { Decimal } from "@prisma/client/runtime/library";
export declare class DecimalNumber extends Decimal {
    constructor(value?: number);
}
export declare class ReviewResponseDTO {
    id: number;
    rating: number;
    feedback: string;
    user: {
        username: string;
    };
    constructor(partial: Partial<ReviewResponseDTO>);
}
