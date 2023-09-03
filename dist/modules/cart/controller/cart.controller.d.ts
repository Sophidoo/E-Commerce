import { CartService } from '../service/cart.service';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    addToCart(productId: number, user: number): Promise<string>;
    increaseCartItemQuantity(cartItemId: number): Promise<string>;
    decreaseCartItemQuantity(cartItemId: number): Promise<string>;
    getAllCartItems(user: number): Promise<{
        id: number;
        quantity: number;
        cartTotal: import("@prisma/client/runtime/library").Decimal;
    }>;
    deleteCartItem(cartItemId: number): Promise<string>;
    clearCart(user: number): Promise<string>;
}
