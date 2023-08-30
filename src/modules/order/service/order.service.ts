import { Injectable, NotFoundException } from '@nestjs/common';
import { CartItems, Order, OrderItems, OrderStatus } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { AuditService } from 'src/modules/audit/service/audit.service';

@Injectable()
export class OrderService {
    constructor (private readonly prismaService : PrismaService, private readonly audtService : AuditService){}

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
                payment: true
            }
        })

        return order

    }


    async viewAllOrders(pageSize? :number, pageNo? : number) : Promise<Order[]>{

        const page = pageNo || 1
        const size = pageSize || 20

        const orders = await this.prismaService.order.findMany({
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

    async updateOrderStatus(id : number, orderStatus : OrderStatus) : Promise<Order>{
        const order = await this.prismaService.order.findUnique({
            where: {
                id
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
                status: orderStatus
            }
        })

        return update
    }


    async checkout(){

    }
}
