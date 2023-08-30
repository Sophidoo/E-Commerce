import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CouponService } from '../service/coupon.service';
import { Roles } from 'src/decorator/roles.decorator';
import { RoleType } from '@prisma/client';
import { CouponDTO, EditCouponDTO } from '../dto/CouponDTO';
import { User } from 'src/decorator/user.decorator';
import { use } from 'passport';

@Controller('api/v1coupon')
export class CouponController {
    constructor(private readonly couponService : CouponService){}

    @Roles(RoleType.ADMIN)
    @Post()
    createCoupon(@Body() dto: CouponDTO, @User() user : number){
        return this.couponService.createCoupon(dto, user)
    }

    @Roles(RoleType.ADMIN)
    @Patch('/:couponId')
    editCOupon(@Param('couponId') couponId : number, dto : EditCouponDTO, @User() user : number){
        return this.couponService.editCoupon(couponId, dto, user)
    }

    @Get('/:couponCode')
    findByCouponCode(@Param('couponCode') couponCode : string){
        return this.couponService.findAParticularCoupon(couponCode)
    }

    @Get('/all')
    viewAllCoupons(){
        return this.couponService.viewAllCoupons()
    }

    @Roles(RoleType.ADMIN)
    @Delete('/:couponId')
    deleteCoupon(@Param('couponId') couponId : number, @User() user : number){
        return this.couponService.deleteCoupon(couponId, user)
    }
}
