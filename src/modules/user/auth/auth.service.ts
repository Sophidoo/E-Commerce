import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { RegisterDTO } from '../dtos/RegisterDTO';
import { User } from '@prisma/client';
import * as bcrypt from "bcrypt"
import * as jwt from "jsonwebtoken"
import {UnauthorizedException, ConflictException} from '@nestjs/common'
import { RoleService } from 'src/modules/role/role.service';
import { LoginDTO } from '../dtos/LoginDTO';

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
        const hashedPassword = await this.hashPassword(dto.password)

        const user = await this.prismaService.user.create({
            data: {
                username: dto.username,
                email: dto.email,
                password: hashedPassword,
                isBlocked: true
            }
        })

        return user
    }

    async login (dto : LoginDTO) : Promise<string> {
        const exists = await this.prismaService.user.findFirst({
            where: {
                OR: [
                    {email : dto.usernameOrEmail},
                    {username : dto.usernameOrEmail}
                ]
            }
        })

        if(!exists){
            throw new UnauthorizedException('The provided username or password is incorrect')
        }

        const passwordMatch = await this.passwordsMatch(exists.password, dto.password)

        if(!passwordMatch){
            throw new UnauthorizedException("The password is incorrect")
        }

        const token = this.signJwt(exists.id) 
        // const role = (await this.roleServicere
        return token

    }

    public async hashPassword (password: string) {
        const salt = await bcrypt.genSalt(10)
        return await bcrypt.hash(password, salt)
    }

    private async passwordsMatch (passwordFromDb: string, loginPassword: string): Promise<boolean> {
        return await bcrypt.compare(loginPassword, passwordFromDb)
    }

    public signJwt ( id: number) {
        return jwt.sign(
            {
                id
            },
            process.env.JWT_SECRET_KEY as string,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        )
    }

    public verifyJwt ( token: string ) {
        return jwt.verify(token, process.env.JWT_SECRET_KEY as string) as {id: string}
    }
    
}
