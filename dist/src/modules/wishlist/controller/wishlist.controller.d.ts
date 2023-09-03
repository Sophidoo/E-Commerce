import { WishlistService } from '../service/wishlist.service';
export declare class WishlistController {
    private readonly wishlistService;
    constructor(wishlistService: WishlistService);
    addToWishlist(productId: number, user: number): Promise<string>;
    removeFromWishList(productId: number, user: number): Promise<"Product does not exists in wishlist" | "Product removed from wishlist">;
    getAlProductInWishlist(user: number, pageNo?: number, pageSize?: number, sortBy?: string, sortDir?: string, filterParam?: string): Promise<import("../dto/PaginatedWishListDTO").PaginatedWishlistDTO>;
}
