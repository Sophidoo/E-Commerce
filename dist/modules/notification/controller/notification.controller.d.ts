import { NoificationService } from '../service/noification.service';
import { NotificationDTO } from '../dto/notificationDTO';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NoificationService);
    sendNotification(user: number, dto: NotificationDTO): Promise<import("../dto/NotificationResponseDTO").NotificationResponseDTO>;
    sendNotificationToAll(dto: NotificationDTO): Promise<string>;
    getUSerNotification(user: number, pageSize: number, pageNo: number): Promise<import("../dto/PaginatedNotificationResponseDTO").PaginatedNotificationDTO>;
    getAllNotifications(pageSize: number, pageNo: number): Promise<import("../dto/PaginatedNotificationResponseDTO").PaginatedNotificationDTO>;
}
