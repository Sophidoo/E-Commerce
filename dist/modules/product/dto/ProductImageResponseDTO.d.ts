import { ProductResponseDTO } from "./ProductResponseDTO";
export declare class ProductImageResponseDTO {
    id: number;
    imageUrl: string;
    defaultImage: boolean;
    product: ProductResponseDTO;
    constructor(partial: Partial<ProductImageResponseDTO>);
}
