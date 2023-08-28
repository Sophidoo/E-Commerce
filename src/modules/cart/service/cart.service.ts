import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Cart, CartItems } from '@prisma/client';
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

        return "Product added to cart sucessfully"

    }

    async increaseCartItemQuantity(id: number){
        const cartitem = await this.prismaService.cartItems.findUnique({
            where: {
                id
            }
        })

        if(!cartitem){
            throw new NotFoundException(`Cart item with id = ${id} does not exist`)
        }

        const productQuantityAvailable = await this.prismaService.product.findUnique({
            where: {
                id: cartitem.productId
            }
        })

        if(productQuantityAvailable.quantityAvailable >= cartitem.quantity){
            throw new BadRequestException(`Only ${productQuantityAvailable.quantityAvailable} ${productQuantityAvailable.productName} are currently available`)
        }

        await this.prismaService.cartItems.update({
            where: {
                id
            },
            data: {
                quantity: cartitem.quantity + 1
            }
        })

        return "Quantity increased by 1"
    }


    async decreaseCartItemQuantity(id: number){
        const cartitem = await this.prismaService.cartItems.findUnique({
            where: {
                id
            }
        })

        if(!cartitem){
            throw new NotFoundException(`Cart item with id = ${id} does not exist`)
        }

        if(cartitem.quantity == 1){
            await this.prismaService.cartItems.delete({
                where: {
                    id
                }
            })
        }

        await this.prismaService.cartItems.update({
            where: {
                id
            },
            data: {
                quantity: cartitem.quantity - 1
            }
        })

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
}
