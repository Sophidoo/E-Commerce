import { ProductResponseDTO } from "./ProductResponseDTO";


export class PaginatedProductDTO{
    data?: ProductResponseDTO[]
    totalPages? : number
    pageSize? : number
    pageNo?: number
    sortBy?: string
    sortDir?: string
    filterBy?: string
    filterParam?: string
}