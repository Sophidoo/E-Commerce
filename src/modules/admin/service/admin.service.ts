import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/database/prisma.service';
import { UserResponseDTO } from 'src/modules/user/dtos/UserResponseDTO';

@Injectable()
export class AdminService {
    constructor (private readonly prismaService : PrismaService){}

    async getAllUsers() : Promise<UserResponseDTO[]>{
        const users = await this.prismaService.user.findMany()

        return users.map(user => plainToInstance(UserResponseDTO, user))
    }

    async blockUser(userId : number) : Promise<UserResponseDTO>{
        const user = await this.prismaService.user.findUnique({
            where: {
                id: userId
            }
        })

        if(!user){
            throw new NotFoundException('User not found')
        }

        const update = await this.prismaService.user.update({
            where: {
                id: userId
            },
            data: {
                isBlocked: true
            }
        })

        return plainToInstance(UserResponseDTO, update)
    }
    
    async unBlockUser(userId : number) : Promise<UserResponseDTO>{
        const user = await this.prismaService.user.findUnique({
            where: {
                id: userId
            }
        })
        
        if(!user){
            throw new NotFoundException('User not found')
        }
        
        const update = await this.prismaService.user.update({
            where: {
                id: userId
            },
            data: {
                isBlocked: false
            }
        })

        return plainToInstance(UserResponseDTO, update)
    }
}
