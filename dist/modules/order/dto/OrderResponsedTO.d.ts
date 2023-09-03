import { Order } from "@prisma/client";
export declare class PaginatedOrderResponseDTO {
    data: Order[];
    pageNo: number;
    pageSize: number;
}
