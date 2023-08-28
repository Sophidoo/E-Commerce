import { Body, Controller, Get, Param, Patch, Post, Delete,Put, UseGuards, Req, HttpStatus, ParseFilePipeBuilder, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { RegisterDTO } from '../../dtos/RegisterDTO';
import { LoginDTO } from '../../dtos/LoginDTO';
import { EditAuthDetailsDTO, EditPasswordDTO, ResetPasswordDTO } from '../../dtos/EditAuthDetailsDTO';
import { User } from '../../../../decorator/user.decorator';
import { Public } from 'src/decorator/public.decorator';
import { Roles } from 'src/decorator/roles.decorator';
import { $Enums, RoleType } from '@prisma/client';
import { UserResponseDTO } from '../../dtos/UserResponseDTO';
import { UpdateUserDTO } from '../../dtos/UpdateUserDTO';
import { LoginResponseDTO } from '../../dtos/LoginResponseDTO';
import { FileInterceptor } from '@nestjs/platform-express';
import { use } from 'passport';

@Controller('api/v1/auth')
export class AuthController {

    constructor(private readonly authService : AuthService){
        
    }

    
    @Public()
    @Post('/signup')
    signup(@Body() dto: RegisterDTO) : Promise<string>{
        return this.authService.signup(dto)
    }

    @Public()
    @Post('/signin')
    signin(@Body() dto: LoginDTO) : Promise<LoginResponseDTO>{
        return this.authService.login(dto)
    }

    @Patch('/update')
    update(@Body() dto: EditAuthDetailsDTO, @User() user: number){
        return this.authService.editUsernameOrEmail(user, dto)
    }

    @Patch('/updatePassword')
    updatePassword(@Body() dto : EditPasswordDTO, @User() user : number){
        return this.authService.updatePassword(user, dto);
    }

    @Patch('/updateDetails')
    updateDetails(@Body() dto : UpdateUserDTO, @User() user : number) : Promise<UserResponseDTO>{
        return this.authService.editUserDetails(dto, user);
    }

    @Public()
    @Patch('/resetPassword/:email')
    resetPassword(@Body() dto : ResetPasswordDTO, @Param('email') email : string){
        return this.authService.resetPassword(email, dto);
    }

    @Public()
    @Get('/forgotPassword/:email')
    sendResetPasswordOtp(@Param('email') email : string){
        return this.authService.sendResetOtp(email)
    }

    @Public()
    @Get('/resetPassword/:email/:token')
    veriftResetPasswordOtp(@Param('email') email : string, @Param('token') token:string){
        return this.authService.verifyResetOtp(token, email)
    }

    @Put('/deactivate')
    deleteAccount(@User() user: number){
        return this.authService.deleteMyAccount(user)
    }
    

    @Roles(RoleType.ADMIN, RoleType.USER)
    @Get()
    getLoggedInUser(@User() user:number){
        return this.authService.getLoggedInUser(user)
    }

    @Public()
    @Get('/verify/:email/:token')
    verifyEmail(@Param('email') email : string, @Param('token') token:string){
        return this.authService.verifyEmail(token, email)
    }
    


    @Public()
    @Get('/verificationMail/:email')
    resendVerificationMail(@Param('email') email : string){
        return this.authService.resendEmailOtp(email)
    }

    @Put('/upload')
    @Roles(RoleType.ADMIN, RoleType.USER)
    @UseInterceptors(FileInterceptor('file'))
    uploadProfile(@UploadedFile(
        new ParseFilePipeBuilder()
        .addFileTypeValidator({
            fileType:  /(jpg|jpeg|png|gif)$/
        })
        .build({
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
        })
    ) file: Express.Multer.File, @User() user: number){
        return this.authService.uploadProfile(file, user)
    }

}
