import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CartService } from '../service/cart.service';
import { User } from 'src/decorator/user.decorator';
import { Roles } from 'src/decorator/roles.decorator';
import { RoleType } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Cart')
@Controller('api/v1/cart')
export class CartController {
    constructor(private readonly cartService : CartService){}

    @Post('/:productId')
    @Roles(RoleType.ADMIN, RoleType.USER)
    addToCart(@Param('productId') productId : number, @User() user : number){
        return this.cartService.addToCart(productId, user)
    }


    @Get('/increase/:cartItemId')
    @Roles(RoleType.ADMIN, RoleType.USER)
    increaseCartItemQuantity(@Param('cartItemId') cartItemId : number){
        return this.cartService.increaseCartItemQuantity(cartItemId)
    }

    @Get('/decrease/:cartItemId')
    @Roles(RoleType.ADMIN, RoleType.USER)
    decreaseCartItemQuantity(@Param('cartItemId') cartItemId : number){
        return this.cartService.decreaseCartItemQuantity(cartItemId)
    }

    @Get()
    @Roles(RoleType.ADMIN, RoleType.USER)
    getAllCartItems(@User() user : number){
        return this.cartService.getAllCartItems(user)
    }

    @Delete('/delete/:cartItemId')
    @Roles(RoleType.ADMIN, RoleType.USER)
    deleteCartItem(@Param('cartItemId') cartItemId: number){
        return this.cartService.deleteCartItem(cartItemId)
    }

    @Delete('/clearCart')
    @Roles(RoleType.ADMIN, RoleType.USER)
    clearCart(@User() user : number){
        return this.cartService.clearCart(user)
    }

}
