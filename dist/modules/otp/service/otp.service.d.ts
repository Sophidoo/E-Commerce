import { OtpType } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { CreateOtpDTO } from '../dtos/createOtpDTO';
import { VerifyOtpDTO } from '../dtos/verifyOtp';
export declare class OtpService {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    createOtp(dto: CreateOtpDTO): Promise<string>;
    verifyOtp(dto: VerifyOtpDTO): Promise<boolean>;
    clearOtp(email: string, otpType: OtpType): Promise<void>;
}
