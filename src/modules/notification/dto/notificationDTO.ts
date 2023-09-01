import { IsBoolean, IsNotEmpty, IsString } from "class-validator"


export class NotificationDTO{
    @IsNotEmpty()
    @IsString()
    notificationType : string
    @IsNotEmpty()
    @IsString()
    content: string
    @IsNotEmpty()
    @IsBoolean()
    isRead: boolean
}