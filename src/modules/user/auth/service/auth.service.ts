import { BadRequestException, Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { RegisterDTO } from '../../dtos/RegisterDTO';
import { OtpType, RoleType, User } from '@prisma/client';
import * as bcrypt from "bcrypt"
import * as jwt from "jsonwebtoken"
import {UnauthorizedException, ConflictException} from '@nestjs/common'
import { LoginDTO } from '../../dtos/LoginDTO';
import { LoginResponseDTO } from '../../dtos/LoginResponseDTO';
import { EditAuthDetailsDTO, EditPasswordDTO, ForgotPasswordDTO, ResetPasswordDTO, verifyOtpDTO } from '../../dtos/EditAuthDetailsDTO';
import { UserResponseDTO } from '../../dtos/UserResponseDTO';
import { OtpService } from 'src/modules/otp/service/otp.service';
import { VerifyOtpDTO } from 'src/modules/otp/dtos/verifyOtp';
import { CreateOtpDTO } from 'src/modules/otp/dtos/createOtpDTO';
import { MailService } from 'src/modules/mail/service/mailer.service';
import { UpdateUserDTO } from '../../dtos/UpdateUserDTO';
import {google, Auth} from 'googleapis'
import {ConfigService} from '@nestjs/config'
import { plainToInstance } from 'class-transformer';
import { CloudinaryService } from 'src/config/cloudinary.service';

@Injectable()
export class AuthService {
    oAuthClient : Auth.OAuth2Client

    constructor(private readonly prismaService : PrismaService, private readonly otpService : OtpService, private readonly mailService: MailService, private readonly configService : ConfigService, private readonly cloudinaryService: CloudinaryService) {
        this.oAuthClient = new google.auth.OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET
        )
    }

    async signup(dto: RegisterDTO): Promise<string>{
        const exists = await this.prismaService.user.findUnique({
            where: {
                email: dto.email
            }
        })

        if(exists){
            throw new ConflictException('Credentials in use')
        }

        const hashedPassword = await this.hashPassword(dto.password)

        const otpDTO = new CreateOtpDTO
        otpDTO.email = dto.email
        otpDTO.otpType = OtpType.REGISTER

        

        const user = await this.prismaService.user.create({
            data: {
                username: dto.username,
                email: dto.email,
                password: hashedPassword,
                isBlocked: false,
                cart: {
                    create: {
                        quantity: 0,
                        cartTotal : 0
                    }
                },
                wishlist: {
                    create: {}
                },
                role: RoleType.USER,
                isVerified: false,
            }
        })

        const otp = await this.otpService.createOtp(otpDTO)

        try{
            await this.mailService.sendOtpMail(dto.email, otp, "Verify your email", 'otp')
        }catch(e){
            throw new InternalServerErrorException(e)
        }


        return "Otp has been sent to your email, Please verify your account"
    }


    async uploadProfile(file: Express.Multer.File, id: number) : Promise<UserResponseDTO>{
        const result = await this.cloudinaryService.uploadFile(file)

        const profile = await this.prismaService.user.findUnique({
            where: {
                id
            }
        })

        if(!profile){
            throw new NotFoundException("User does not exist")
        }

        const profileImage = await this.prismaService.user.update({
            where: {
                id
            },
            data: {
                image: result.url
            },
            select: {
                image: true
            }
        })

        return plainToInstance(UserResponseDTO, profileImage)

    }

   

    async verifyEmail(token: string, email: string) : Promise<string> {
        const user = await this.prismaService.user.findUnique({
            where: {
                email
            }
        })

        if(!user){
            throw new NotFoundException()
        }

        if(user.isVerified) {return "User already verified"}

        const verifyOtpDTO = new VerifyOtpDTO()
        verifyOtpDTO.email = user.email
        verifyOtpDTO.otpType = OtpType.REGISTER
        verifyOtpDTO.token = token

        const verified = await this.otpService.verifyOtp(verifyOtpDTO)

        if(verified){
            await this.prismaService.user.update({
                where:{
                    email
                }, 
                data: {
                    isVerified: true
                }
            })

            return "User Successfully Verified"
        }

        return "Incorrect Token"
    }

    async editUserDetails(dto: UpdateUserDTO, id: number) : Promise<UserResponseDTO>{
        const user = await this.prismaService.user.findUnique({
            where: {
                id
            }
        })

        if(!user){
            throw new UnauthorizedException('You do not have ccess to this account')
        }

        const updatedUser = await this.prismaService.user.update({
            where: {
                id
            },
            data: {
                ...dto
            }
        })

        return plainToInstance(UserResponseDTO, updatedUser)
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

        if(!exists.isVerified){
            throw new UnauthorizedException('Please verify your account')
        }
        
        if(exists.isBlocked){
            throw new UnauthorizedException('Account is blocked, Please contact support')
        }

        const passwordMatch = await this.passwordsMatch(exists.password, dto.password)
        if(!passwordMatch){
            throw new UnauthorizedException("The password is incorrect")
        }

        
        const token = this.signJwt(exists.id) 
        const role = exists.role
        return plainToInstance(LoginResponseDTO, {token, role})

    }

    async getLoggedInUser(id: number) : Promise<UserResponseDTO>{
        const user = await this.prismaService.user.findUnique({
            where: {
                id
            },
            include:{
                address: true
            }
        })
        return plainToInstance(UserResponseDTO, user)
    }

    async  deleteMyAccount(id : number) : Promise<string>{
        await this.prismaService.user.update({
            where: {
                id
            },
            data: {
                isVerified: false
            }
        })

        return "Account Deactivated Successfully"
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

        
        const updatedUser = await this.prismaService.user.update({
            where: {
                id
            },
            data: {
                ...dto
            }
        })

        return plainToInstance(EditAuthDetailsDTO, updatedUser)
        
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
            throw new BadRequestException("new password and confirm password does not match")
        }

        const hashedPassword = await this.hashPassword(dto.confirmPassword)

        await this.prismaService.user.update({
            where: {
                id
            },
            data: {
                password: hashedPassword
            }
        })
        

        return "Password Updated Successfully"
    }

    async verifyResetOtp(token: string, email: string) : Promise<string> {
        const user = await this.prismaService.user.findUnique({
            where: {
                email
            }
        })

        if(!user){
            throw new NotFoundException()
        }

        const verifyOtpDTO = new VerifyOtpDTO()
        verifyOtpDTO.email = user.email
        verifyOtpDTO.otpType = OtpType.RESET
        verifyOtpDTO.token = token

        const verified = await this.otpService.verifyOtp(verifyOtpDTO)

        if(verified){
            return "Verification Successfull"
        }

        return "Incorrect Token"
    }

    async resendEmailOtp(email : string) : Promise<string>{

        const otpDTO = new CreateOtpDTO
        otpDTO.email = email
        otpDTO.otpType = OtpType.REGISTER

        const otp = await this.otpService.createOtp(otpDTO)

        try{
            await this.mailService.sendOtpMail(email, otp, "Verify your email", 'otp')
        }catch(e){
            throw new InternalServerErrorException(e)
        }
        return "Otp sent successfully"
    }

    async sendResetOtp(email: string) : Promise<string>{
        const otpDTO = new CreateOtpDTO
        otpDTO.email = email
        otpDTO.otpType = OtpType.RESET

        const otp = await this.otpService.createOtp(otpDTO)

        try{
            await this.mailService.sendOtpMail(email, otp, "Verify your email", 'reset')
        }catch(e){
            throw new InternalServerErrorException(e)
        }
        return "Otp sent successfully"
    }

    async resetPassword(email: string, dto : ResetPasswordDTO) : Promise<string>{
        const user = await this.prismaService.user.findUnique({
            where: {
                email
            }
        })

        if(!user){
            throw new NotFoundException("User not found")
        }

        if(dto.newPassword !== dto.confirmPassword){
            throw new BadRequestException("new password and confirm password does not match")
        }

        const hashedPassword = await this.hashPassword(dto.newPassword)

        await this.prismaService.user.update({
            where: {
                email
            },
            data: {
                password: hashedPassword
            }
        })

        return "Password Reset Successfull"
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
