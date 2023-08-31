import { OrderStatus } from "@prisma/client";
import { IsEnum, IsNotEmpty } from "class-validator";


export class OrderStatusDTO {
    @IsNotEmpty()
    @IsEnum(OrderStatus)
    orderStatus : OrderStatus
}