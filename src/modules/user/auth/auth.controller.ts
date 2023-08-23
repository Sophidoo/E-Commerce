import { Body, Controller, Get, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from '../dtos/RegisterDTO';
import { LoginDTO } from '../dtos/LoginDTO';
import { EditAuthDetailsDTO, EditPasswordDTO } from '../dtos/EditAuthDetailsDTO';
import { User } from '../../../decorator/user.decorator';
import { Public } from 'src/decorator/public.decorator';
import { Roles } from 'src/decorator/roles.decorator';
import { $Enums, RoleType } from '@prisma/client';
import { UserResponseDTO } from '../dtos/UserResponseDTO';

@Controller('api/v1/auth')
export class AuthController {
    constructor(private readonly authService : AuthService){}

    
    @Public()
    @Post('/signup')
    signup(@Body() dto: RegisterDTO) : Promise<UserResponseDTO>{
        return this.authService.signup(dto)
    }

    @Public()
    @Post('/signin')
    signin(@Body() dto: LoginDTO){
        return this.authService.login(dto)
    }

    @Patch('/update')
    update(@Body() dto: EditAuthDetailsDTO, @User() user: number){
        return this.authService.editUsernameOrEmail(user, dto)
    }

    @Put('/updatePassword')
    updatePassword(@Body() dto : EditPasswordDTO, @User() user : number){
        return this.authService.updatePassword(user, dto);
    }

    @Roles(RoleType.ADMIN, RoleType.USER)
    @Get()
    getLoggedInUser(@User() user:number){
        return this.authService.getLoggedInUser(user)
    }
    

}
