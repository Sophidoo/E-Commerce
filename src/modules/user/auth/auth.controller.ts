import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from '../dtos/RegisterDTO';
import { LoginDTO } from '../dtos/LoginDTO';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService : AuthService){}

    @Post('/signup')
    signup(@Body() dto: RegisterDTO){
        return this.authService.signup(dto)
    }

    @Post('/signin')
    signin(@Body() dto: LoginDTO){
        return this.authService.login(dto)
    }

}
