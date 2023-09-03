"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const library_1 = require("@prisma/client/runtime/library");
const prisma_service_1 = require("../../../database/prisma.service");
let CartService = class CartService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async addToCart(productId, userId) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        const product = await this.prismaService.product.findUnique({
            where: {
                id: productId
            }
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with id = ${productId} does not exist in the database`);
        }
        const productInCart = await this.prismaService.cartItems.findFirst({
            where: {
                AND: {
                    cartId: user.cartId,
                    productId: product.id
                }
            }
        });
        const cartItems = await this.prismaService.cart.findUnique({
            where: {
                id: user.cartId
            }
        }).cartItems();
        let updateCart;
        if (!productInCart) {
            updateCart = await this.prismaService.cartItems.create({
                data: {
                    cartId: user.cartId,
                    productId: product.id,
                    quantity: 1,
                    subTotal: product.productPrice,
                }
            });
            const total = cartItems.reduce((a, cartItem) => {
                return a.add(cartItem.subTotal);
            }, new library_1.Decimal(0));
            const cartQuantity = cartItems.length;
            await this.prismaService.cart.update({
                where: {
                    id: user.cartId
                },
                data: {
                    cartTotal: total.add(product.productPrice),
                    quantity: cartQuantity + 1
                }
            });
            return "Product added to cart sucessfully";
        }
        updateCart = await this.prismaService.cartItems.update({
            where: {
                id: productInCart.id
            },
            data: {
                quantity: productInCart.quantity + 1,
                subTotal: productInCart.subTotal.add(product.productPrice),
            }
        });
        const total = cartItems.reduce((a, cartItem) => {
            return a.add(cartItem.subTotal);
        }, new library_1.Decimal(0));
        const cartQuantity = cartItems.length;
        await this.prismaService.cart.update({
            where: {
                id: user.cartId
            },
            data: {
                cartTotal: total.add(product.productPrice),
            }
        });
        return "Product added to cart sucessfully";
    }
    async increaseCartItemQuantity(cartItemId) {
        const cartitem = await this.prismaService.cartItems.findUnique({
            where: {
                id: cartItemId
            }
        });
        if (!cartitem) {
            throw new common_1.NotFoundException(`Cart item with id = ${cartItemId} does not exist`);
        }
        const productQuantityAvailable = await this.prismaService.product.findUnique({
            where: {
                id: cartitem.productId
            }
        });
        if (!productQuantityAvailable) {
            throw new common_1.NotFoundException('Product no longer exists in database');
        }
        if (productQuantityAvailable.quantityAvailable == cartitem.quantity) {
            throw new common_1.BadRequestException(`Only ${productQuantityAvailable.quantityAvailable} ${productQuantityAvailable.productName} are currently available`);
        }
        await this.prismaService.cartItems.update({
            where: {
                id: cartItemId
            },
            data: {
                quantity: cartitem.quantity + 1,
                subTotal: cartitem.subTotal.add(productQuantityAvailable.productPrice)
            }
        });
        const cartItems = await this.prismaService.cart.findUnique({
            where: {
                id: cartitem.cartId
            }
        }).cartItems();
        const total = cartItems.reduce((a, cartItem) => {
            return a.add(cartItem.subTotal);
        }, new library_1.Decimal(0));
        await this.prismaService.cart.update({
            where: {
                id: cartitem.cartId
            },
            data: {
                cartTotal: total,
            }
        });
        return "Quantity increased by 1";
    }
    async decreaseCartItemQuantity(cartItemId) {
        const cartitem = await this.prismaService.cartItems.findUnique({
            where: {
                id: cartItemId
            }
        });
        if (!cartitem) {
            throw new common_1.NotFoundException(`Cart item with id = ${cartItemId} does not exist`);
        }
        const cartItems = await this.prismaService.cart.findUnique({
            where: {
                id: cartitem.cartId
            }
        }).cartItems();
        const total = cartItems.reduce((a, cartItem) => {
            return a.add(cartItem.subTotal);
        }, new library_1.Decimal(0));
        if (cartitem.quantity == 1) {
            await this.prismaService.cartItems.delete({
                where: {
                    id: cartItemId
                }
            });
            await this.prismaService.cart.update({
                where: {
                    id: cartitem.cartId
                },
                data: {
                    quantity: cartItems.length - 1,
                    cartTotal: total.minus(cartitem.subTotal)
                }
            });
            return "Quantity decreased by 1";
        }
        const product = await this.prismaService.product.findUnique({
            where: {
                id: cartitem.productId
            }
        });
        if (!product) {
            throw new common_1.NotFoundException('Product no longer exists in database');
        }
        await this.prismaService.cart.update({
            where: {
                id: cartitem.cartId
            },
            data: {
                cartTotal: total.minus(product.productPrice),
            }
        });
        await this.prismaService.cartItems.update({
            where: {
                id: cartItemId
            },
            data: {
                quantity: cartitem.quantity - 1,
                subTotal: cartitem.subTotal.minus(product.productPrice)
            }
        });
        return "Quantity decreased by 1";
    }
    async getAllCartItems(id) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id
            }
        });
        if (!user) {
            throw new common_1.NotFoundException("User does not exist");
        }
        const cart = await this.prismaService.cart.findUnique({
            where: {
                id: user.cartId
            },
            select: {
                id: true,
                cartTotal: true,
                quantity: true,
                _count: true,
                cartItems: {
                    select: {
                        product: {
                            select: {
                                productImages: true,
                                productName: true,
                                productPrice: true,
                                brand: true,
                                category: {
                                    select: {
                                        categoryName: true
                                    }
                                },
                                description: true,
                                createdAt: true,
                                updatedAt: true,
                                quantityAvailable: true,
                                size: true
                            }
                        },
                        quantity: true,
                        subTotal: true
                    }
                }
            }
        });
        return cart;
    }
    async deleteCartItem(cartItemId) {
        const cartitem = await this.prismaService.cartItems.findUnique({
            where: {
                id: cartItemId
            }
        });
        if (!cartitem) {
            throw new common_1.NotFoundException(`Cart item with id = ${cartItemId} does not exist`);
        }
        await this.prismaService.cartItems.delete({
            where: {
                id: cartItemId
            }
        });
        const cartItems = await this.prismaService.cart.findUnique({
            where: {
                id: cartitem.cartId
            }
        }).cartItems();
        const total = cartItems.reduce((a, cartItem) => {
            return a.add(cartItem.subTotal);
        }, new library_1.Decimal(0));
        await this.prismaService.cart.update({
            where: {
                id: cartitem.cartId
            },
            data: {
                cartTotal: total,
                quantity: cartItems.length
            }
        });
        return "Cart item deleted successfully";
    }
    async clearCart(id) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id
            }
        });
        await this.prismaService.cartItems.deleteMany({
            where: {
                cartId: user.cartId
            }
        });
        await this.prismaService.cart.update({
            where: {
                id: user.cartId
            },
            data: {
                quantity: 0,
                cartTotal: 0
            }
        });
        return "Cart cleared successfully";
    }
};
CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CartService);
exports.CartService = CartService;
//# sourceMappingURL=cart.service.js.map