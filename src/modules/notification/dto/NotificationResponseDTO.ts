import { Exclude, Expose } from "class-transformer"


@Exclude()
export class NotificationResponseDTO{
    @Expose()
    id: string
    @Expose()
    notificationType : string
    @Expose()
    content: string
    @Expose()
    isRead: boolean

    constructor(partial : Partial<NotificationResponseDTO>){
        Object.assign(this, partial)
    }
}