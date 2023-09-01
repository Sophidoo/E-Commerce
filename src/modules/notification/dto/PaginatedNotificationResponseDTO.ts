import { NotificationResponseDTO } from "./NotificationResponseDTO";


export class PaginatedNotificationDTO{
    data: NotificationResponseDTO[]
    pageSize: number
    pageNo: number
    totalPages: number
}