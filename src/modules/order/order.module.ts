import { Module } from '@nestjs/common';
import { OrderController } from './controller/order.controller';
import { OrderService } from './service/order.service';
import { PrismaModule } from 'src/database/prisma.module';
import { AuditService } from '../audit/service/audit.service';
import { AddressModule } from '../address/address.module';
import { AddressService } from '../address/service/address.service';
import { PaymentService } from './service/payment.service';
import { PaymentController } from './controller/payment.controller';

@Module({
  controllers: [OrderController, PaymentController],
  providers: [OrderService, AuditService, AddressService, PaymentService],
  imports: [PrismaModule]
})
export class OrderModule {}
