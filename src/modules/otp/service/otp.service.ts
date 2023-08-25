import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Otp, OtpType } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import * as speakeasy from "speakeasy"
import { CreateOtpDTO } from '../dtos/createOtpDTO';
import { VerifyOtpDTO } from '../dtos/verifyOtp';

@Injectable()
export class OtpService{
    constructor(private readonly prismaService : PrismaService){}

    async createOtp(dto:CreateOtpDTO) : Promise<string>{

        const user = await this.prismaService.user.findUnique({
            where: {
                email: dto.email
            }
        })

        if(!user){
            throw new NotFoundException("User with this email does not exist")
        }

        const otp = await this.prismaService.otp.findFirst({
            where: {
                otpType: dto.otpType,
                userEmail : dto.email
            }
        })

        if(otp) await this.clearOtp(dto.email, dto.otpType)

        const currentDate = new Date()
        const token = speakeasy.totp({
            secret: dto.email,
            encoding: 'base32'
          });

        const otpToken = await this.prismaService.otp.create({
            data: {
                token: token,
                userEmail: dto.email,
                expiryDate: new Date(currentDate.getTime() + (10 * 60 * 1000)),
                otpType: dto.otpType
            }
        })

        return otpToken.token
    }

    async verifyOtp(dto: VerifyOtpDTO) : Promise<boolean>{
        const otp = await this.prismaService.otp.findFirst({
            where: {
                token : dto.token,
                otpType: dto.otpType,
                userEmail : dto.email
            }
        })

        if(!otp){
            throw new NotFoundException("Incorrect Otp")
        }
        const today = new Date()
        const elapsedTime = otp.expiryDate.getTime() - otp.createdAt.getTime()

        if(elapsedTime > today.getTime()){
            throw new UnauthorizedException("Otp Expired")
        }

        await this.clearOtp(dto.email, dto.otpType)

        return true
    }

    async clearOtp(email: string, otpType: OtpType){
        await this.prismaService.otp.deleteMany({
            where: {
                otpType,
                userEmail: email
            }
        })
    }
}
