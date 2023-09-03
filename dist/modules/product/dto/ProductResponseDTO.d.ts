import { $Enums } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
export declare class DecimalNumber extends Decimal {
    constructor(value?: number);
}
export declare class ProductResponseDTO {
    id: number;
    productName: string;
    productPrice: DecimalNumber;
    quantityAvailable: number;
    size: $Enums.Size;
    images: string[];
    categoryName: string;
    description: string;
    brand: string;
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<ProductResponseDTO>);
}
