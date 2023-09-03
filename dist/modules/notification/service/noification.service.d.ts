import { PrismaService } from 'src/database/prisma.service';
import { NotificationDTO } from '../dto/notificationDTO';
import { NotificationResponseDTO } from '../dto/NotificationResponseDTO';
import { PaginatedNotificationDTO } from '../dto/PaginatedNotificationResponseDTO';
export declare class NoificationService {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    sendNotificationToUser(userId: number, dto: NotificationDTO): Promise<NotificationResponseDTO>;
    sendNotificationTOAll(dto: NotificationDTO): Promise<string>;
    getAllUserNotification(userId: number, pageSize: number, pageNo: number): Promise<PaginatedNotificationDTO>;
    getAllNotifications(pageSize: number, pageNo: number): Promise<PaginatedNotificationDTO>;
}
