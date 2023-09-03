import { Cart } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
export declare class CartService {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    addToCart(productId: number, userId: number): Promise<string>;
    increaseCartItemQuantity(cartItemId: number): Promise<string>;
    decreaseCartItemQuantity(cartItemId: number): Promise<string>;
    getAllCartItems(id: number): Promise<Cart>;
    deleteCartItem(cartItemId: number): Promise<string>;
    clearCart(id: number): Promise<string>;
}
