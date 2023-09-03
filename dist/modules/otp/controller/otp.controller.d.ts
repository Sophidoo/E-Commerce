import { OtpService } from '../service/otp.service';
import { CreateOtpDTO } from '../dtos/createOtpDTO';
import { VerifyOtpDTO } from '../dtos/verifyOtp';
export declare class OtpController {
    private readonly otpService;
    constructor(otpService: OtpService);
    createOtp(dto: CreateOtpDTO): Promise<string>;
    verifyOtp(dto: VerifyOtpDTO): Promise<boolean>;
}
