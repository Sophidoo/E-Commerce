import { $Enums } from "@prisma/client";
export declare class ProductDTO {
    productName: string;
    productPrice: number;
    quantityAvailable: number;
    size: $Enums.Size;
    category: string;
    description: string;
    brand: string;
}
