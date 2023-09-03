import { ProductResponseDTO } from "./ProductResponseDTO";
export declare class PaginatedProductDTO {
    data?: ProductResponseDTO[];
    totalPages?: number;
    pageSize?: number;
    pageNo?: number;
    sortBy?: string;
    sortDir?: string;
    filterBy?: string;
    filterParam?: string;
}
