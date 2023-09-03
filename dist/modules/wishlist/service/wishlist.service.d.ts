import { PrismaService } from 'src/database/prisma.service';
import { PaginatedWishlistDTO } from '../dto/PaginatedWishListDTO';
import { Pagination } from '../dto/Pagination';
export declare class WishlistService {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    addToWishList(productId: number, userId: number): Promise<string>;
    removeFromWishList(productId: number, userId: number): Promise<"Product does not exists in wishlist" | "Product removed from wishlist">;
    viewAllInWishlist({ pageNo, pageSize, sortBy, sortDir, filterParam }: Pagination, id: number): Promise<PaginatedWishlistDTO>;
}
