import { WishList } from "@prisma/client";
import { WishListResponseDTO } from "./WishlistResponseDTO";


export class PaginatedWishlistDTO{
    data?: WishListResponseDTO
    totalPages? : number
    pageSize? : number
    pageNo?: number
    sortBy?: string
    sortDir?: string
    filterBy?: string
    filterParam?: string
}