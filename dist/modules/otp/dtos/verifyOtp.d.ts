import { OtpType } from "@prisma/client";
export declare class VerifyOtpDTO {
    email: string;
    otpType: OtpType;
    token: string;
}
