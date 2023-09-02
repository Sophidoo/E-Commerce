import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { NoificationService } from '../service/noification.service';
import { User } from 'src/decorator/user.decorator';
import { NotificationDTO } from '../dto/notificationDTO';
import { Roles } from 'src/decorator/roles.decorator';
import { RoleType } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Notification')
@Controller('api/v1/notification')
export class NotificationController {
    constructor(private readonly notificationService : NoificationService){}


    @Post()
    @Roles(RoleType.ADMIN)
    sendNotification(@User() user: number, @Body() dto : NotificationDTO){
        return this.notificationService.sendNotificationToUser(user, dto)
    }

    @Post('/all')
    @Roles(RoleType.ADMIN)
    sendNotificationToAll( @Body() dto : NotificationDTO){
        return this.notificationService.sendNotificationTOAll(dto)
    }
    
    @Get('/user')
    @Roles(RoleType.USER, RoleType.ADMIN)
    getUSerNotification(@User() user: number, @Query('pageSize') pageSize : number, @Query('pageNo') pageNo: number){
        return this.notificationService.getAllUserNotification(user, pageSize, pageNo)
    }

    @Get('/all')
    @Roles(RoleType.ADMIN)
    getAllNotifications( @Query('pageSize') pageSize : number, @Query('pageNo') pageNo: number){
        return this.notificationService.getAllNotifications(pageSize, pageNo)
    }
}
