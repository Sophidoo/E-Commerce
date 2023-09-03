/// <reference types="multer" />
import { AuthService } from '../service/auth.service';
import { RegisterDTO } from '../../dtos/RegisterDTO';
import { LoginDTO } from '../../dtos/LoginDTO';
import { EditAuthDetailsDTO, EditPasswordDTO, ResetPasswordDTO } from '../../dtos/EditAuthDetailsDTO';
import { UserResponseDTO } from '../../dtos/UserResponseDTO';
import { UpdateUserDTO } from '../../dtos/UpdateUserDTO';
import { LoginResponseDTO } from '../../dtos/LoginResponseDTO';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signup(dto: RegisterDTO): Promise<string>;
    signin(dto: LoginDTO): Promise<LoginResponseDTO>;
    update(dto: EditAuthDetailsDTO, user: number): Promise<EditAuthDetailsDTO>;
    updatePassword(dto: EditPasswordDTO, user: number): Promise<string>;
    updateDetails(dto: UpdateUserDTO, user: number): Promise<UserResponseDTO>;
    resetPassword(dto: ResetPasswordDTO, email: string): Promise<string>;
    sendResetPasswordOtp(email: string): Promise<string>;
    veriftResetPasswordOtp(email: string, token: string): Promise<string>;
    deleteAccount(user: number): Promise<string>;
    getLoggedInUser(user: number): Promise<UserResponseDTO>;
    verifyEmail(email: string, token: string): Promise<string>;
    resendVerificationMail(email: string): Promise<string>;
    uploadProfile(file: Express.Multer.File, user: number): Promise<UserResponseDTO>;
}
