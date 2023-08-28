import { Controller, Get, Param, Post } from '@nestjs/common';
import { CartService } from '../service/cart.service';
import { User } from 'src/decorator/user.decorator';
import { Roles } from 'src/decorator/roles.decorator';
import { RoleType } from '@prisma/client';

@Controller('api/v1/cart')
export class CartController {
    constructor(private readonly cartService : CartService){}

    @Post('/:productId')
    @Roles(RoleType.ADMIN, RoleType.USER)
    addToCart(@Param('productId') productId : number, @User() user : number){
        return this.cartService.addToCart(productId, user)
    }


    @Get('/increase/:id')
    @Roles(RoleType.ADMIN, RoleType.USER)
    increaseCartItemQuantity(@Param('id') id : number){
        return this.cartService.increaseCartItemQuantity(id)
    }

    @Get('/decrease/:id')
    @Roles(RoleType.ADMIN, RoleType.USER)
    decreaseCartItemQuantity(@Param('id') id : number){
        return this.cartService.decreaseCartItemQuantity(id)
    }

    @Get()
    @Roles(RoleType.ADMIN, RoleType.USER)
    getAllCartItems(@User() user : number){
        return this.cartService.getAllCartItems(user)
    }


}
