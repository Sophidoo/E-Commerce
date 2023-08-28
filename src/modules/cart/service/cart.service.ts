import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Cart, CartItems } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class CartService {
    constructor(private readonly prismaService : PrismaService){}

    async addToCart(productId : number, userId : number) : Promise<string> {
        const user = await this.prismaService.user.findUnique({
            where: {
                id: userId
            }
        })

        if(!user){
            throw new NotFoundException("User not found")
        }

        const product = await this.prismaService.product.findUnique({
            where: {
                id: productId
            }
        })

        if(!product){
            throw new NotFoundException(`Product with id = ${productId} does not exist in the database`)
        }

        const productInCart = await this.prismaService.cartItems.findFirst({
            where: {
                AND: {
                    cartId: user.cartId,
                    productId: product.id
                }
            }
        })

        const cartItems = await this.prismaService.cart.findUnique({
            where: {
                id: user.cartId
            }
        }).cartItems()

        let updateCart : CartItems;

        if(!productInCart){
            updateCart = await this.prismaService.cartItems.create({
                data: {
                    cartId: user.cartId,
                    productId: product.id,
                    quantity: 1,
                    subTotal: product.productPrice,
                }
            })

            const total: Decimal = cartItems.reduce((a, cartItem) => {
                return a.add(cartItem.subTotal);
              }, new Decimal(0));

            const cartQuantity = cartItems.length

            await this.prismaService.cart.update({
                where: {
                    id: user.cartId
                },
                data: {
                    cartTotal: total.add(product.productPrice),
                    quantity: cartQuantity+1
                }
            })
            

            return "Product added to cart sucessfully"
        }

        updateCart = await this.prismaService.cartItems.update({
            where: {
                id: productInCart.id
            },
            data: {
                quantity: productInCart.quantity + 1,
                subTotal: productInCart.subTotal.add(product.productPrice),
            }
        })

        const total: Decimal = cartItems.reduce((a, cartItem) => {
            return a.add(cartItem.subTotal);
          }, new Decimal(0));

        const cartQuantity = cartItems.length

        await this.prismaService.cart.update({
            where: {
                id: user.cartId
            },
            data: {
                cartTotal: total.add(product.productPrice),
            }
        })

        return "Product added to cart sucessfully"

    }

    async increaseCartItemQuantity(cartItemId: number){
        const cartitem = await this.prismaService.cartItems.findUnique({
            where: {
                id: cartItemId
            }
        })

        if(!cartitem){
            throw new NotFoundException(`Cart item with id = ${cartItemId} does not exist`)
        }

        const productQuantityAvailable = await this.prismaService.product.findUnique({
            where: {
                id: cartitem.productId
            }
        })

        if(!productQuantityAvailable){
            throw new NotFoundException('Product no longer exists in database')
        }

        if(productQuantityAvailable.quantityAvailable == cartitem.quantity){
            throw new BadRequestException(`Only ${productQuantityAvailable.quantityAvailable} ${productQuantityAvailable.productName} are currently available`)
        }

        await this.prismaService.cartItems.update({
            where: {
                id: cartItemId
            },
            data: {
                quantity: cartitem.quantity + 1,
                subTotal: cartitem.subTotal.add(productQuantityAvailable.productPrice) 
            }
        })


        const cartItems = await this.prismaService.cart.findUnique({
            where: {
                id: cartitem.cartId
            }
        }).cartItems()
        
        const total: Decimal = cartItems.reduce((a, cartItem) => {
            return a.add(cartItem.subTotal);
          }, new Decimal(0));


        await this.prismaService.cart.update({
            where: {
                id: cartitem.cartId
            },
            data: {
                cartTotal: total,
            }
        })

        // update cart total, quantity and subtotal

        return "Quantity increased by 1"
    }


    async decreaseCartItemQuantity(cartItemId: number){
        const cartitem = await this.prismaService.cartItems.findUnique({
            where: {
                id: cartItemId
            }
        })

        if(!cartitem){
            throw new NotFoundException(`Cart item with id = ${cartItemId} does not exist`)
        }

        const cartItems = await this.prismaService.cart.findUnique({
            where: {
                id: cartitem.cartId
            }
        }).cartItems()

        const total: Decimal = cartItems.reduce((a, cartItem) => {
            return a.add(cartItem.subTotal);
          }, new Decimal(0));

        if(cartitem.quantity == 1){
            await this.prismaService.cartItems.delete({
                where: {
                    id: cartItemId
                }
            })
            await this.prismaService.cart.update({
                where: {
                    id: cartitem.cartId
                },
                data: {
                    quantity: cartItems.length -1,
                    cartTotal: total.minus(cartitem.subTotal)
                }
            })

            return "Quantity decreased by 1"
        }

    
        const product = await this.prismaService.product.findUnique({
            where: {
                id: cartitem.productId
            }
        })

        if(!product){
            throw new NotFoundException('Product no longer exists in database')
        }

        await this.prismaService.cart.update({
            where: {
                id: cartitem.cartId
            },
            data: {
                cartTotal: total.minus(product.productPrice),
            }
        })

        await this.prismaService.cartItems.update({
            where: {
                id: cartItemId
            },
            data: {
                quantity: cartitem.quantity - 1,
                subTotal: cartitem.subTotal.minus(product.productPrice)
            }
        })

        // update cart total, quantity and subtotal

        return "Quantity decreased by 1"
    }

    async getAllCartItems(id: number) : Promise<Cart>{
        const user = await this.prismaService.user.findUnique({
            where: {
                id
            }
        })

        if(!user){
            throw new NotFoundException("User does not exist")
        }

        const cart = await this.prismaService.cart.findUnique({
            where : {
                id: user.cartId
            },
            select: {
                id: true,
                cartTotal: true,
                quantity: true,
                _count: true,
                cartItems: {
                    select: {
                        product: true,
                        quantity: true,
                        subTotal: true
                    }
                }
            }
        })

        return cart
    }

    async deleteCartItem(cartItemId: number) : Promise<string>{
        const cartitem = await this.prismaService.cartItems.findUnique({
            where: {
                id: cartItemId
            }
        })

        if(!cartitem){
            throw new NotFoundException(`Cart item with id = ${cartItemId} does not exist`)
        }

        await this.prismaService.cartItems.delete({
            where: {
                id: cartItemId
            }
        })

        // Get all cart items in the user's cart
        const cartItems = await this.prismaService.cart.findUnique({
            where: {
                id: cartitem.cartId
            }
        }).cartItems()

        // caluclate the total of the cart items
        const total: Decimal = cartItems.reduce((a, cartItem) => {
            return a.add(cartItem.subTotal);
        }, new Decimal(0));

        // update the cart quantity and total
        await this.prismaService.cart.update({
            where: {
                id: cartitem.cartId
            },
            data: {
                cartTotal: total,
                quantity: cartItems.length
            }
        })

        return "Cart item deleted successfully"
    }

    async clearCart(id: number) : Promise<string>{
        const user = await this.prismaService.user.findUnique({
            where: {
                id
            }
        })

        await this.prismaService.cartItems.deleteMany({
            where: {
                cartId: user.cartId
            }
        })

        await this.prismaService.cart.update({
            where: {
                id: user.cartId
            },
            data: {
                quantity: 0,
                cartTotal: 0
            }
        })

        return "Cart cleared successfully"
    }

    
}
