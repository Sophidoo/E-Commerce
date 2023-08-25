import { IsNotEmpty, IsOptional, IsStrongPassword } from "class-validator"

export class EditAuthDetailsDTO{
    @IsOptional()
    @IsNotEmpty()
    username: string

    @IsOptional()
    @IsNotEmpty()
    email: string
}

export class EditPasswordDTO{
    @IsNotEmpty({message: "Please input your current password"})
    oldPassword: string

    @IsStrongPassword()
    @IsNotEmpty({message: "Please input your new password"})
    newPassword: string

    @IsNotEmpty()
    confirmPassword: string
}

export class ForgotPasswordDTO{
    @IsNotEmpty({message: "Please enter the email linked to this account"})
    email: string
}

export class ResetPasswordDTO{
    @IsStrongPassword()
    @IsNotEmpty({message: "Please input your new password"})
    newPassword: string

    @IsNotEmpty()
    confirmPassword: string
}

export class verifyOtpDTO{
    otp: string
}