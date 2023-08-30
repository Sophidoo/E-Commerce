import { Module } from '@nestjs/common';
import { OrderController } from './controller/order.controller';
import { OrderService } from './service/order.service';
import { PrismaModule } from 'src/database/prisma.module';
import { AuditService } from '../audit/service/audit.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService, AuditService],
  imports: [PrismaModule]
})
export class OrderModule {}
