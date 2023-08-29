import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { WishlistService } from '../service/wishlist.service';
import { User } from 'src/decorator/user.decorator';
import { RoleType } from '@prisma/client';
import { Roles } from 'src/decorator/roles.decorator';

@Controller('api/v1/wishlist')
export class WishlistController {
    constructor(private readonly wishlistService : WishlistService){}

    @Get('/add/:productId')
    @Roles(RoleType.ADMIN, RoleType.USER)
    addToWishlist(@Param('productId') productId : number, @User() user: number){
        return this.wishlistService.addToWishList(productId, user)
    }

    @Get('/remove/:productId')
    removeFromWishList(@Param('productId') productId : number, @User() user: number){
        return this.wishlistService.removeFromWishList(productId, user)
    }

    @Get('/all')
    getAlProductInWishlist(@User() user : number, @Query('pageNo') pageNo? : number, @Query('pageSize') pageSize? : number, @Query('sortBy') sortBy? : string, @Query('sortDir') sortDir? : string, @Query('filterParam') filterParam? : string){
        return this.wishlistService.viewAllInWishlist({pageNo, pageSize, sortBy, sortDir, filterParam}, user)
    }
}
