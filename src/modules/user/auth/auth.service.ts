import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { RegisterDTO } from '../dtos/RegisterDTO';
import { User } from '@prisma/client';
import bcrypt from "bcrypt"
import {BadRequestException, ConflictException} from '@nestjs/common'
import { RoleService } from 'src/modules/role/role.service';

@Injectable()
export class AuthService {
    constructor(private readonly prismaService : PrismaService, private readonly roleService : RoleService) {}

    async signup(dto: RegisterDTO): Promise<User>{
        const exists = await this.prismaService.user.findUnique({
            where: {
                email: dto.email
            }
        })

        if(exists){
            throw new ConflictException('Credentials in use')
        }


        const role = (await this.roleService.findByRoleName("USER")).id
        // const hashedPassword = await this.hashPassword(dto.password)

        const user = await this.prismaService.user.create({
            data: {
                username: dto.username,
                email: dto.email,
                password: dto.password,
                isBlocked: true
            }
        })

        return user
    }


    // public async hashPassword (password: string) {
    //     const salt = await bcrypt.genSalt(10)
    //     return await bcrypt.hash(password, 10)
    // }

    private async passwordsMatch (passwordFromDb: string, loginPassword: string): Promise<boolean> {
        return await bcrypt.compare(loginPassword, passwordFromDb)
    }


    
}
