import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { OrderService } from '../service/order.service';
import { User } from 'src/decorator/user.decorator';
import { CheckoutDTO } from '../dto/CheckoutDTO';
import { Roles } from 'src/decorator/roles.decorator';
import { OrderStatus, RoleType } from '@prisma/client';
import { OrderStatusDTO } from '../dto/OrderStatusDTO';

@Controller('api/v1/order')
export class OrderController {
    constructor(private readonly orderService : OrderService){}


    @Roles(RoleType.ADMIN, RoleType.USER)
    @Post()
    async checkout (@User() user : number, @Body() dto: CheckoutDTO){
        return this.orderService.checkout(user, dto)
    }

    @Roles(RoleType.ADMIN, RoleType.USER)
    @Get('/findOne/:orderId')
    async viewAOrder(@Param('orderId') orderId : number) {
        return this.orderService.viewAParticularOrder(orderId)
    }

    @Roles(RoleType.ADMIN)
    @Get('/all')
    async viewAllorders(@Query('pageSize') pageSize: number, @Query('pageNo') pageNo : number) {
        return this.orderService.viewAllOrders(pageSize, pageNo)
    }

    @Roles(RoleType.ADMIN, RoleType.USER)
    @Get('/userOrders')
    async viewAParticularUserOrderHistory(@User() user : number, @Query('pageSize') pageSize: number, @Query('pageNo') pageNo : number){
        return this.orderService.viewUserOrderHistory(user, pageSize, pageNo)
    }

    @Roles(RoleType.ADMIN)
    @Patch('/:orderId')
    async updateOrderStatus(@Param('orderId') orderId : number, @Body() dto : OrderStatusDTO){
        return this.orderService.updateOrderStatus(orderId, dto)
    }
}
