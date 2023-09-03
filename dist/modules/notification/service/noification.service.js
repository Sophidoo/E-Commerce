"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoificationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../database/prisma.service");
const NotificationResponseDTO_1 = require("../dto/NotificationResponseDTO");
const class_transformer_1 = require("class-transformer");
const PaginatedNotificationResponseDTO_1 = require("../dto/PaginatedNotificationResponseDTO");
let NoificationService = class NoificationService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async sendNotificationToUser(userId, dto) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) {
            throw new common_1.NotFoundException('User with this id not found');
        }
        const notification = await this.prismaService.notification.create({
            data: {
                content: dto.content,
                isRead: dto.isRead,
                notificationType: dto.notificationType,
                user: {
                    connect: {
                        id: user.id
                    }
                }
            }
        });
        return (0, class_transformer_1.plainToInstance)(NotificationResponseDTO_1.NotificationResponseDTO, notification);
    }
    async sendNotificationTOAll(dto) {
        const users = await this.prismaService.user.findMany({
            where: {
                AND: {
                    isBlocked: {
                        not: true
                    },
                    isVerified: true
                }
            }
        });
        users.map(async (user) => {
            await this.prismaService.notification.create({
                data: {
                    content: dto.content,
                    isRead: dto.isRead,
                    notificationType: dto.notificationType,
                    user: {
                        connect: {
                            id: user.id
                        }
                    }
                }
            });
        });
        return `Notification sent to ${users.length} valid users`;
    }
    async getAllUserNotification(userId, pageSize, pageNo) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) {
            throw new common_1.NotFoundException('User with this id not found');
        }
        const page = pageNo || 1;
        const size = pageSize || 20;
        const notifications = await this.prismaService.notification.findMany({
            where: {
                user: {
                    every: {
                        userId: user.id
                    }
                }
            },
            take: size,
            skip: (page - 1) * size,
            orderBy: {
                createdAt: "desc"
            }
        });
        const totalCount = notifications.length;
        const response = new PaginatedNotificationResponseDTO_1.PaginatedNotificationDTO();
        response.data = notifications.map(notification => (0, class_transformer_1.plainToInstance)(NotificationResponseDTO_1.NotificationResponseDTO, notification));
        response.pageNo = page;
        response.pageSize = size;
        response.totalPages = Math.ceil(totalCount / size);
        return response;
    }
    async getAllNotifications(pageSize, pageNo) {
        const page = pageNo || 1;
        const size = pageSize || 20;
        const notifications = await this.prismaService.notification.findMany({
            take: size,
            skip: (page - 1) * size,
            orderBy: {
                createdAt: "desc"
            }
        });
        const totalCount = notifications.length;
        const response = new PaginatedNotificationResponseDTO_1.PaginatedNotificationDTO();
        response.data = notifications.map(notification => (0, class_transformer_1.plainToInstance)(NotificationResponseDTO_1.NotificationResponseDTO, notification));
        response.pageNo = page;
        response.pageSize = size;
        response.totalPages = Math.ceil(totalCount / size);
        return response;
    }
};
NoificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NoificationService);
exports.NoificationService = NoificationService;
//# sourceMappingURL=noification.service.js.map