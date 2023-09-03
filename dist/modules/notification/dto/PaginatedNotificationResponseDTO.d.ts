import { NotificationResponseDTO } from "./NotificationResponseDTO";
export declare class PaginatedNotificationDTO {
    data: NotificationResponseDTO[];
    pageSize: number;
    pageNo: number;
    totalPages: number;
}
