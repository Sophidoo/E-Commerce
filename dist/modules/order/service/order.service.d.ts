import { $Enums, Order } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/database/prisma.service';
import { AddressService } from 'src/modules/address/service/address.service';
import { AuditService } from 'src/modules/audit/service/audit.service';
import { CheckoutDTO } from '../dto/CheckoutDTO';
import { OrderStatusDTO } from '../dto/OrderStatusDTO';
import { PaginatedOrderResponseDTO } from '../dto/OrderResponsedTO';
import { PaymentService } from './payment.service';
import { NoificationService } from 'src/modules/notification/service/noification.service';
export declare class OrderService {
    private readonly prismaService;
    private readonly audtService;
    private readonly addressService;
    private readonly paymentService;
    private readonly notificationService;
    constructor(prismaService: PrismaService, audtService: AuditService, addressService: AddressService, paymentService: PaymentService, notificationService: NoificationService);
    viewUserOrderHistory(id: number, pageSize?: number, pageNo?: number): Promise<Order[]>;
    viewAParticularOrder(orderId: number): Promise<Order>;
    viewAllOrders(pageSize?: number, pageNo?: number): Promise<PaginatedOrderResponseDTO>;
    updateOrderStatus(id: number, dto: OrderStatusDTO): Promise<Order>;
    checkout(userId: number, dto: CheckoutDTO): Promise<{
        id: number;
        dateOrdered: Date;
        dateDelivered: Date;
        totalPrice: Decimal;
        status: $Enums.OrderStatus;
        userId: number;
        deliveryType: $Enums.DeliveryType;
        addressId: number;
    }>;
}
