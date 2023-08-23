import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { RegisterDTO } from '../dtos/RegisterDTO';
import { RoleType, User } from '@prisma/client';
import * as bcrypt from "bcrypt"
import * as jwt from "jsonwebtoken"
import {UnauthorizedException, ConflictException} from '@nestjs/common'
import { LoginDTO } from '../dtos/LoginDTO';
import { LoginResponseDTO } from '../dtos/LoginResponseDTO';
import { EditAuthDetailsDTO, EditPasswordDTO, ForgotPasswordDTO, ResetPasswordDTO } from '../dtos/EditAuthDetailsDTO';
import { UserResponseDTO } from '../dtos/UserResponseDTO';

@Injectable()
export class AuthService {
    constructor(private readonly prismaService : PrismaService) {}

    async signup(dto: RegisterDTO): Promise<UserResponseDTO>{
        const exists = await this.prismaService.user.findUnique({
            where: {
                email: dto.email
            }
        })

        if(exists){
            throw new ConflictException('Credentials in use')
        }


        const hashedPassword = await this.hashPassword(dto.password)

        const user = await this.prismaService.user.create({
            data: {
                username: dto.username,
                email: dto.email,
                password: hashedPassword,
                isBlocked: true,
                cart: {
                    create: {
                        quantity: 0,
                        cartTotal : 0
                    }
                },
                wishlist: {
                    create: {}
                },
                role: RoleType.USER
            }
        })

        //TODO: create Email verification 


        return user
    }

    async login (dto : LoginDTO) : Promise<LoginResponseDTO> {
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
        const role = "USER"
        return {token, role: "USER"} 

    }

    async getLoggedInUser(id: number) : Promise<User>{
        const user = await this.prismaService.user.findUnique({
            where: {
                id
            }
        })
        return user
    }

    async  deleteMyAccount(id : number) : Promise<string>{
        await this.prismaService.user.delete({
            where: {
                id
            }
        })

        // TODO: delete cascade that is everything related to it 

        return "Account Deleted Successfully"
    }

    async editUsernameOrEmail(id : number, dto : EditAuthDetailsDTO) : Promise<EditAuthDetailsDTO>{
        const user = await this.prismaService.user.findUnique({
            where: {
                id
            }
        })

        if(!user){
            throw new NotFoundException("User not found")
        }

        
        return this.prismaService.user.update({
            where: {
                id
            },
            data: {
                ...dto
            }
        })
        
    }

    async updatePassword( id: number, dto : EditPasswordDTO) : Promise<string>{
        const user = await this.prismaService.user.findUnique({
            where: {
                id
            }
        })

        if(!user){
            throw new NotFoundException("User not found")
        }

        const passwordMatch = await this.passwordsMatch(user.password, dto.oldPassword)

        if(!passwordMatch){
            throw new BadRequestException("Incorrect Password")
        }

        if(dto.newPassword !== dto.confirmPassword){
            throw new BadRequestException("new password and cnofirm password does not match")
        }

        const hashedPassword = await this.hashPassword(dto.newPassword)

        this.prismaService.user.update({
            where: {
                id
            },
            data: {
                password: hashedPassword
            }
        })

        return "Password Updated Successfully"
    }

    async forgotPassword(dto : ForgotPasswordDTO) : Promise<string>{
        return null
    }

    async resendOtp() : Promise<string>{
        return "Otp sent successfully"
    }

    async resetPassword(id : number, dto : ResetPasswordDTO) : Promise<string>{
        const user = await this.prismaService.user.findUnique({
            where: {
                id
            }
        })

        if(!user){
            throw new NotFoundException("User not found")
        }

        const hashedPassword = await this.hashPassword(dto.password)

        this.prismaService.user.update({
            where: {
                id
            },
            data: {
                password: hashedPassword
            }
        })

        return "Password Reset Successfull"
    }

    async googleAuth() : Promise<User>{
        return null
    }


    async grenerateVerificationToken () {
        const currentDate = new Date()
        const expirationDate = new Date(currentDate.getTime() + (24 * 60 * 60 * 1000));
        // const otp = crypto.randomBytes()
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
