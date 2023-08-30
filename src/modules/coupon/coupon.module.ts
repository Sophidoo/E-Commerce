import { Module } from '@nestjs/common';
import { CouponController } from './controller/coupon.controller';
import { CouponService } from './service/coupon.service';
import { PrismaModule } from 'src/database/prisma.module';
import { AuditService } from '../audit/service/audit.service';

@Module({
  controllers: [CouponController],
  providers: [CouponService, AuditService],
  imports: [PrismaModule]
})
export class CouponModule {}
