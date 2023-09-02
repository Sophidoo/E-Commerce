import { Body, Controller, Get, Post } from '@nestjs/common';
import { OtpService } from '../service/otp.service';
import { CreateOtpDTO } from '../dtos/createOtpDTO';
import { VerifyOtpDTO } from '../dtos/verifyOtp';
import { Public } from 'src/decorator/public.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Otp')
@Controller('otp')
export class OtpController {
    constructor(private readonly otpService : OtpService){}
    
    @Public()
    @Post('/create')
    createOtp(@Body() dto: CreateOtpDTO){
        return this.otpService.createOtp(dto)
    }

    @Public()
    @Post('/verify')
    verifyOtp(@Body() dto: VerifyOtpDTO){
        return this.otpService.verifyOtp(dto)
    }
}
