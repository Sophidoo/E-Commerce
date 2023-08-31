import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import * as https from 'https'
import { $Enums, Address, CartItems, Order, OrderItems, OrderStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/database/prisma.service';
import { AddressService } from 'src/modules/address/service/address.service';
import { AuditService } from 'src/modules/audit/service/audit.service';
import { CheckoutDTO } from '../dto/CheckoutDTO';
import { plainToClass, plainToInstance } from 'class-transformer';
import { AddressResponseDTO } from 'src/modules/address/dto/AddressResponseDTO';
import { AddressDTO } from 'src/modules/address/dto/addressDTO';
import { OrderStatusDTO } from '../dto/OrderStatusDTO';
import { PaginatedOrderResponseDTO } from '../dto/OrderResponsedTO';
import { PaymentService } from './payment.service';

@Injectable()
export class OrderService {
    constructor (private readonly prismaService : PrismaService, private readonly audtService : AuditService, private readonly addressService : AddressService, private readonly paymentService : PaymentService){}

    async viewUserOrderHistory(id : number, pageSize? :number, pageNo? : number): Promise<Order[]>{

        const page = pageNo || 1
        const size = pageSize || 20

        const orders = await this.prismaService.order.findMany({
            where: {
                userId: id
            },
            include: {
                orderItems: true,
                payment: true
            },
            orderBy: {
                dateOrdered: "desc"
            },
            take: size,
            skip: (page - 1) * size,
        })

        return orders
    }

    async viewAParticularOrder(orderId : number) : Promise<Order>{
        const findOrder = await this.prismaService.order.findUnique({
            where: {
                id: orderId
            },
            select: {
                address: true,
                orderItems: {
                    select: {
                        product: true,
                        quantity: true,
                        subTotal: true
                    }
                },
                dateDelivered: true,
                dateOrdered: true,
                status: true,
                deliveryType: true,
                totalPrice: true,
                payment: true
            }
        })

        if(!findOrder){
            throw new NotFoundException('Order not found')
        }

        const order = await this.prismaService.order.findUnique({
            where:{
                id: orderId
            },
            include: {
                orderItems: true,
                payment: true,
                address: true
            }
        })

        return order

    }


    async viewAllOrders(pageSize? :number, pageNo? : number) : Promise<PaginatedOrderResponseDTO>{

        const page = pageNo || 1
        const size = pageSize || 20

        const orders = await this.prismaService.order.findMany({
            include: {
                orderItems: true,
                payment: true,
                user: {
                    select: {
                        username: true,
                        firstname: true,
                        lastname: true,
                        email: true,
                        image: true
                    }
                }
            },
            orderBy: {
                dateOrdered: "desc"
            },
            take: size,
            skip: (page - 1) * size,
        })

        const orderResponse = new PaginatedOrderResponseDTO
        orderResponse.data = orders
        orderResponse.pageNo = (page - 1) * size
        orderResponse.pageSize = size

        return orderResponse
    }

    async updateOrderStatus(id : number, dto: OrderStatusDTO) : Promise<Order>{
        const order = await this.prismaService.order.findUnique({
            where: {
                id
            },
            include: {
                user: {
                    select: {
                        username: true,
                        firstname: true,
                        lastname: true,
                        email: true,
                        image: true
                    }
                }
            }
        })

        if(!order){
            throw new NotFoundException('Order not found')
        }

        const update = await this.prismaService.order.update({
            where: {
                id
            },
            data: {
                status: dto.orderStatus
            }
        })

        return update
    }



    async checkout(userId : number, dto : CheckoutDTO){
        const user = await this.prismaService.user.findUnique({
            where: {
                id: userId
            }
        })

        console.log("User Exists")

        if(!user){
            throw new NotFoundException('Invalid or Expired Token')
        }

        const cartItems = await this.prismaService.cartItems.findMany({
            where: {
                cartId: user.cartId
            }
        })

        console.log("Cart items retreived")

        const orderItemsData = cartItems.map(cartItem => ({
            productId: cartItem.productId,
            quantity: cartItem.quantity,
            subTotal: cartItem.subTotal
        }));

        cartItems.map(async cartItem => {
            const product = await this.prismaService.product.findUnique({
                where: {
                    id: cartItem.productId
                }
            })

            if(!product){
                throw new NotFoundException(`A product you are trying to purchase with id = ${product.id} is no longer available`)
            }

            if(cartItem.quantity > product.quantityAvailable){
                throw new BadRequestException(`Product with id = ${product.id} has only ${product.quantityAvailable} left}`)
            }

            await this.prismaService.product.update({
                where: {
                    id: product.id
                },
                data: {
                    quantityAvailable: product.quantityAvailable - cartItem.quantity
                }
            })


        })

        console.log("Cart items changed to order items")

        const total = orderItemsData.reduce((total , item) =>  total.add(item.subTotal) , new Decimal(0))

        let address : AddressResponseDTO

        if(dto.useDefaultShippingAddress){
            address = await this.addressService.getDefaultAddress(userId).catch(e => {
                throw new InternalServerErrorException(e)
            })

            console.log("Default shipping address exists")
        }

        if(!dto.useDefaultShippingAddress){
            const createAddress = new AddressDTO
            createAddress.city = dto.city,
            createAddress.country = dto.country,
            createAddress.state = dto.state,
            createAddress.streetAddress = dto.streetAddress,
            createAddress.isDefaultShippingAddress = false

            address = await this.addressService.addAddress(userId, createAddress)
            console.log("Address created")
        }

        if(dto.deliveryType == 'PICKUP'){
            const order = await this.prismaService.order.create({
                data: {
                    dateOrdered: new Date(),
                    deliveryType: dto.deliveryType,
                    status: 'PENDING',
                    userId : userId,
                    totalPrice: total,
                    orderItems: {
                        createMany: {
                            data: orderItemsData
                        }
                    }
                }
                
            })
            
            return order
        }

        const order = await this.prismaService.order.create({
            data: {
                dateOrdered: new Date(),
                deliveryType: dto.deliveryType,
                status: 'PENDING',
                userId : userId,
                totalPrice: total,
                orderItems: {
                    createMany: {
                        data: orderItemsData
                    }
                },
                addressId: address.id
            },
            include: {
                address: true,
                user: true
            }
            
        })

        await this.paymentService.initializePayment(order.user.email, order.totalPrice).catch(e => {
            throw new Error(e)
        })
        
        
        return order

    }


}
