import { OtpType } from "@prisma/client"
import { IsNotEmpty } from "class-validator"

export class VerifyOtpDTO{
    @IsNotEmpty()
    email: string

    @IsNotEmpty()
    otpType: OtpType

    @IsNotEmpty()
    token: string
}