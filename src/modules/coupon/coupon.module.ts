import { Module } from '@nestjs/common';
import { CouponController } from './controller/coupon.controller';
import { CouponService } from './service/coupon.service';

@Module({
  controllers: [CouponController],
  providers: [CouponService]
})
export class CouponModule {}
