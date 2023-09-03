/// <reference types="multer" />
import { PrismaService } from 'src/database/prisma.service';
import { RegisterDTO } from '../../dtos/RegisterDTO';
import { LoginDTO } from '../../dtos/LoginDTO';
import { LoginResponseDTO } from '../../dtos/LoginResponseDTO';
import { EditAuthDetailsDTO, EditPasswordDTO, ResetPasswordDTO } from '../../dtos/EditAuthDetailsDTO';
import { UserResponseDTO } from '../../dtos/UserResponseDTO';
import { OtpService } from 'src/modules/otp/service/otp.service';
import { MailService } from 'src/modules/mail/service/mailer.service';
import { UpdateUserDTO } from '../../dtos/UpdateUserDTO';
import { Auth } from 'googleapis';
import { ConfigService } from '@nestjs/config';
import { CloudinaryService } from 'src/config/cloudinary.service';
export declare class AuthService {
    private readonly prismaService;
    private readonly otpService;
    private readonly mailService;
    private readonly configService;
    private readonly cloudinaryService;
    oAuthClient: Auth.OAuth2Client;
    constructor(prismaService: PrismaService, otpService: OtpService, mailService: MailService, configService: ConfigService, cloudinaryService: CloudinaryService);
    signup(dto: RegisterDTO): Promise<string>;
    uploadProfile(file: Express.Multer.File, id: number): Promise<UserResponseDTO>;
    verifyEmail(token: string, email: string): Promise<string>;
    editUserDetails(dto: UpdateUserDTO, id: number): Promise<UserResponseDTO>;
    login(dto: LoginDTO): Promise<LoginResponseDTO>;
    getLoggedInUser(id: number): Promise<UserResponseDTO>;
    deleteMyAccount(id: number): Promise<string>;
    editUsernameOrEmail(id: number, dto: EditAuthDetailsDTO): Promise<EditAuthDetailsDTO>;
    updatePassword(id: number, dto: EditPasswordDTO): Promise<string>;
    verifyResetOtp(token: string, email: string): Promise<string>;
    resendEmailOtp(email: string): Promise<string>;
    sendResetOtp(email: string): Promise<string>;
    resetPassword(email: string, dto: ResetPasswordDTO): Promise<string>;
    hashPassword(password: string): Promise<string>;
    private passwordsMatch;
    signJwt(id: number): string;
    verifyJwt(token: string): {
        id: string;
    };
}
