import { OtpType } from "@prisma/client"
import { IsNotEmpty } from "class-validator"

export class CreateOtpDTO{
    @IsNotEmpty()
    email: string

    @IsNotEmpty()
    otpType: OtpType
}