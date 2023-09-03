import { OrderService } from '../service/order.service';
import { CheckoutDTO } from '../dto/CheckoutDTO';
import { OrderStatusDTO } from '../dto/OrderStatusDTO';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    checkout(user: number, dto: CheckoutDTO): Promise<{
        id: number;
        dateOrdered: Date;
        dateDelivered: Date;
        totalPrice: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.OrderStatus;
        userId: number;
        deliveryType: import(".prisma/client").$Enums.DeliveryType;
        addressId: number;
    }>;
    viewAOrder(orderId: number): Promise<{
        id: number;
        dateOrdered: Date;
        dateDelivered: Date;
        totalPrice: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.OrderStatus;
        userId: number;
        deliveryType: import(".prisma/client").$Enums.DeliveryType;
        addressId: number;
    }>;
    viewAllorders(pageSize: number, pageNo: number): Promise<import("../dto/OrderResponsedTO").PaginatedOrderResponseDTO>;
    viewAParticularUserOrderHistory(user: number, pageSize: number, pageNo: number): Promise<{
        id: number;
        dateOrdered: Date;
        dateDelivered: Date;
        totalPrice: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.OrderStatus;
        userId: number;
        deliveryType: import(".prisma/client").$Enums.DeliveryType;
        addressId: number;
    }[]>;
    updateOrderStatus(orderId: number, dto: OrderStatusDTO): Promise<{
        id: number;
        dateOrdered: Date;
        dateDelivered: Date;
        totalPrice: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.OrderStatus;
        userId: number;
        deliveryType: import(".prisma/client").$Enums.DeliveryType;
        addressId: number;
    }>;
}
