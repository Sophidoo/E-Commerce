import { Controller, UseGuards, Get, Req } from '@nestjs/common';
import { GoogleStrategyService } from '../service/google-strategy.service';
import { AuthGuard } from '@nestjs/passport';
import { Public } from 'src/decorator/public.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Google Authentication')
@Controller('google')
export class GoogleStrategyController {
    constructor(private readonly googleStrategyService : GoogleStrategyService){}

    @Public()
    @Get()
    @UseGuards(AuthGuard('google'))
    async googleAuth(){}
    
    @Public()
    @Get('redirect')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req : any ){
        return this.googleStrategyService.googleLogin(req)
    }


}

