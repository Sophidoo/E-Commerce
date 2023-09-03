import { WishList } from "@prisma/client";
export declare class PaginatedWishlistDTO {
    data?: WishList;
    totalPages?: number;
    pageSize?: number;
    pageNo?: number;
    sortBy?: string;
    sortDir?: string;
    filterBy?: string;
    filterParam?: string;
}
