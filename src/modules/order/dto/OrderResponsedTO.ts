import { Order } from "@prisma/client";


export class PaginatedOrderResponseDTO{
    data: Order[]
    pageNo : number
    pageSize: number
}