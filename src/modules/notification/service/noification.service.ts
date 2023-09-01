import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { NotificationDTO } from '../dto/notificationDTO';
import { NotificationResponseDTO } from '../dto/NotificationResponseDTO';
import { plainToInstance } from 'class-transformer';
import { PaginatedNotificationDTO } from '../dto/PaginatedNotificationResponseDTO';

@Injectable()
export class NoificationService {
    constructor(private readonly prismaService : PrismaService){}

    async sendNotificationToUser(userId : number, dto : NotificationDTO) : Promise<NotificationResponseDTO>{
        const user = await this.prismaService.user.findUnique({
            where: {
                id: userId
            }
        })

        if(!user){
            throw new NotFoundException('User with this id not found')
        }

        const notification = await this.prismaService.notification.create({
            data : {
                content : dto.content,
                isRead : dto.isRead,
                notificationType : dto.notificationType,
                user  : {
                    connect: {
                        id: user.id
                    }
                }            
            }
        })

        return plainToInstance(NotificationResponseDTO, notification)
    }

    async sendNotificationTOAll(dto : NotificationDTO) : Promise<string>{
        const users = await this.prismaService.user.findMany({
            where: {
                AND: {
                    isBlocked : {
                      not : true
                    },
                    isVerified: true
                }
            }
        })

        users.map(async user => {
            await this.prismaService.notification.create({
                data : {
                    content : dto.content,
                    isRead : dto.isRead,
                    notificationType : dto.notificationType,
                    user  : {
                        connect: {
                            id: user.id
                        }
                    }            
                }
            })
        })

        return `Notification sent to ${users.length} valid users`
    }

    async getAllUserNotification(userId : number, pageSize : number, pageNo : number) : Promise<PaginatedNotificationDTO>{
        const user = await this.prismaService.user.findUnique({
            where: {
                id: userId
            }
        })

        if(!user){
            throw new NotFoundException('User with this id not found')
        }

        const page = pageNo || 1
        const size = pageSize || 20

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
        })

        const totalCount = notifications.length

        const response = new PaginatedNotificationDTO()
        response.data = notifications.map(notification => plainToInstance(NotificationResponseDTO, notification))
        response.pageNo = page
        response.pageSize = size
        response.totalPages = Math.ceil(totalCount/size)

        return response
    }

    async getAllNotifications(pageSize : number, pageNo : number) : Promise<PaginatedNotificationDTO>{
        const page = pageNo || 1
        const size = pageSize || 20

        const notifications = await this.prismaService.notification.findMany({
            take: size,
            skip: (page - 1) * size,
            orderBy: {
                createdAt: "desc"
            }
        })

        const totalCount = notifications.length

        const response = new PaginatedNotificationDTO()
        response.data = notifications.map(notification => plainToInstance(NotificationResponseDTO, notification))
        response.pageNo = page
        response.pageSize = size
        response.totalPages = Math.ceil(totalCount/size)

        return response
    }
}
