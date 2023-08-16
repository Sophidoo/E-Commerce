import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from '../dtos/RegisterDTO';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService : AuthService){}

    @Post('/signup')
    signup(@Body() dto: RegisterDTO){
        return this.authService.signup(dto)
    }

}
