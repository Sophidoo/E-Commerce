import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsNotEmpty, IsOptional, IsStrongPassword } from "class-validator"

export class EditAuthDetailsDTO{
    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    username?: string
    
    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    email?: string
    
    constructor(partial: Partial<EditAuthDetailsDTO>){
        Object.assign(this, partial)
    }
}

export class EditPasswordDTO{
    @ApiProperty()
    @IsNotEmpty({message: "Please input your current password"})
    oldPassword: string
    
    @ApiProperty()
    @IsStrongPassword()
    @IsNotEmpty({message: "Please input your new password"})
    newPassword: string
    
    @IsNotEmpty()
    @ApiProperty()
    confirmPassword: string
}

export class ForgotPasswordDTO{
    @ApiProperty()
    @IsNotEmpty({message: "Please enter the email linked to this account"})
    email: string
}

export class ResetPasswordDTO{
    @ApiProperty()
    @ApiProperty()
    @IsStrongPassword()
    @IsNotEmpty({message: "Please input your new password"})
    newPassword: string
    
    @ApiProperty()
    @IsNotEmpty()
    confirmPassword: string
}

export class verifyOtpDTO{
    @ApiProperty()
    otp: string
}